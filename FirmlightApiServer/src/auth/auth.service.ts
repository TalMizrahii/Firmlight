import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User} from "../users/Schemas/User.schema";
import {Model} from "mongoose";
import {AuthRegisterDto, AuthLoginDto} from "./DTO/";
import {v4 as uuidv4} from 'uuid';
import {RegisterResponseType} from "./Types";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    /**
     * Constructor for the AuthService.
     * @param userModel The user model.
     * @param jwtService The JWT service.
     */
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {
    }

    /**
     * Registers a user.
     * @param authRegisterDto The register DTO.
     */
    async register(authRegisterDto: AuthRegisterDto) {
        const existingUser = await this.userModel.findOne({
            $or: [{email: authRegisterDto.email}, {username: authRegisterDto.username}],
        }).exec();
        if (existingUser) {
            if (existingUser.email === authRegisterDto.email) {
                throw new ConflictException('Email already in use');
            }
            if (existingUser.username === authRegisterDto.username) {
                throw new ConflictException('Username already in use');
            }
        }
        const userID = uuidv4();
        const tokens = await this.getTokens(
            authRegisterDto.email,
            authRegisterDto.username,
            userID);

        const newUser = new this.userModel({
            password: authRegisterDto.password,
            ...authRegisterDto,
            id: userID,
            accessToken: await this.hashData(tokens.accessToken),
            refreshToken: await this.hashData(tokens.refreshToken),
            groupRequests: [],
            alerts: [],
        });
        // Save the user to the database.
        await newUser.save();
        console.log(newUser.username + ' has been registered');
        // Return the response parsed.
        return this.buildRegisterResponse({
            ...newUser.toObject(),
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken,
        } as User);
    }

    /**
     * Logs in a user.
     * @param authLoginDto The login DTO.
     */
    async login(authLoginDto: AuthLoginDto) {
        const user = await this.validateLogin(authLoginDto);
        if (!user) {
            throw new ForbiddenException('Access Denied');
        }
        // Generate tokens and update them
        const tokens = await this.getTokens(user.email, user.username, user.id);
        await this.updateTokens(user.id, tokens.refreshToken, tokens.accessToken);
        console.log(user.username + ' has logged in at ' + new Date());
        // Return the response with tokens
        return this.buildRegisterResponse({
            ...user.toObject(),
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken,
        } as User);
    }

    // /**
    //  * Logs in a worker.
    //  * @param authLoginDto The login DTO.
    //  */
    // async workerLogin(authLoginDto: AuthLoginDto): Promise<boolean> {
    //     try {
    //         const user = await this.validateLogin(authLoginDto);
    //         if (!user) {
    //             throw new ForbiddenException('Access Denied');
    //         }
    //         // Generate tokens and update them
    //         console.log(user.username + ' has logged in at ' + new Date());
    //         // Return the response with tokens
    //         return true;
    //     } catch (e) {
    //         console.log("error worker login: " + e);
    //         return false;
    //     }
    // }


    /**
     * Autologin a user.
     * @param accessToken The access token.
     * @param userId The user's ID.
     */
    async autologin(accessToken: string, userId: string) {
        const user = await this.userModel.findOne({id: userId}).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.accessToken === null || user.refreshToken === null) {
            throw new ForbiddenException('Access Denied, please log in again.');
        }
        const isAccessTokenCorrect = await bcrypt.compare(accessToken, user.accessToken);
        if (!isAccessTokenCorrect) {
            throw new ForbiddenException('Access Denied');
        }
        const tokens = await this.getTokens(user.email, user.username, user.id);
        // Update the tokens.
        await this.updateTokens(user.id, tokens.refreshToken, tokens.accessToken);
        console.log(user.username + ' has autologged in at ' + new Date());
        // Return the response parsed.
        return this.buildRegisterResponse({
            ...user.toObject(),
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken,
        } as User);
    }

    /**
     * Logs out a user.
     * @param userId The user's ID.
     */
    async logout(userId: string): Promise<{ message: string }> {
        const user = await this.userModel.findOne({id: userId}).exec();
        console.log(user.username + ' has logged out at ' + new Date());
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.accessToken === null || user.refreshToken === null) {
            throw new ForbiddenException('Access Denied');
        }
        try {
            // Update the user document to nullify the access and refresh tokens
            await this.userModel.findOneAndUpdate(
                {id: userId},
                {accessToken: null, refreshToken: null}
            ).exec();
            return {message: 'Logged out successfully'};
        } catch (error) {
            throw new NotFoundException('Error during logout');
        }
    }

    /**
     * Refreshes a user's tokens.
     * @param userId The user's ID.
     * @param refreshToken The refresh token.
     */
    async refresh(userId: string, refreshToken: string) {
        // Find the user by ID.
        const user = await this.userModel.findOne({id: userId}).exec();
        // If the user is not found, throw an error.
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.accessToken === null) {
            throw new ForbiddenException('Access Denied');
        }

        // Validate the refresh token against the stored hashed refresh token
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

        if (!isRefreshTokenValid) {
            throw new ForbiddenException('Invalid refresh token');
        }
        // Get the tokens.
        const tokens = await this.getTokens(user.email, user.username, user.id);
        // Update the tokens.
        await this.updateTokens(user.id, tokens.refreshToken, tokens.accessToken);
        // Return the tokens.
        return tokens
    }


    /**
     * Validates a login.
     * @param authLoginDto
     * @private
     */
    private async validateLogin(authLoginDto: AuthLoginDto): Promise<User> {
        const {usernameOrEmail, password} = authLoginDto;
        console.log("worker login attempt: " + usernameOrEmail + "at " + new Date());
        // Determine if the input is an email or username
        const query = {
            $or: [
                {username: usernameOrEmail},
                {email: usernameOrEmail}
            ]
        };
        // Find the user by username or email
        const user = await this.userModel.findOne(query).select('+password').exec();
        // If the user is not found, throw an error.
        if (!user) {
            throw new ForbiddenException('Access Denied');
        }
        // Check if the user data is missing before comparing the password.
        if (!user.password || !user.username || !user.email || !password) {
            throw new BadRequestException('User data is missing');
        }
        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new ForbiddenException('Access Denied');
        }
        return user;
    }

    /**
     * Updates the refresh token for a user.
     * @param userId The user's ID.
     * @param refreshToken The new refresh token.
     * @param accessToken The new access token.
     */
    async updateTokens(userId: string, refreshToken: string, accessToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        const hashedAccessToken = await this.hashData(accessToken);
        try {
            return await this.userModel.findOneAndUpdate({id: userId}, {
                refreshToken: hashedRefreshToken,
                accessToken: hashedAccessToken
            }).exec();
        } catch (e) {
            throw new NotFoundException('Error updating refresh token');
        }
    }

    /**
     * Gets the access and refresh tokens for a user.
     * @param userEmail The user's email.
     * @param username The user's username.
     * @param userID
     */
    async getTokens(userEmail: string, username: string, userID: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                    sub: username,
                    email: userEmail,
                    userID: userID,
                }, {
                    secret: process.env.JWT_AT_SECRET,
                    expiresIn: '14h',
                }
            ),
            this.jwtService.signAsync({
                    sub: username,
                    email: userEmail,
                    userID: userID,
                },
                {
                    secret: process.env.JWT_RT_SECRET,
                    expiresIn: '17d',
                }
            )
        ]);
        return {
            accessToken: at,
            refreshToken: rt,
        }
    }

    /**
     * Builds the response for a user registration.
     * @param user The user to build the response for.
     */
    buildRegisterResponse(user: User): RegisterResponseType {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
        };
    }

    /**
     * Hashes data.
     * @param data The data to hash.
     */
    async hashData(data: string) {
        return await bcrypt.hash(data, 10);
    }

}
