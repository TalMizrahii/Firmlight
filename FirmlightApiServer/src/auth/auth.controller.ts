import {Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthLoginDto, AuthRegisterDto, AuthLogoutDto, AuthAutologinDto, AuthRefreshDto} from "./DTO";
import {RegisterResponseType} from "./Types";
import {AuthGuard} from "@nestjs/passport";
import {JwtService} from "@nestjs/jwt";
import {
    extractToken,
    validateAccessTokenUserId,
    validateRefreshTokenUserId,
} from './utils/auth.utils';
import {ApiTags, ApiOperation, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {RegisterResponseAPI} from "./API/RegisterResponseAPI";
import {TokensResponseAPI} from "./API/TokensResponseAPI";


@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private jwtService: JwtService
    ) {
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({summary: 'Register a new user'})
    @ApiResponse({status: 201, description: 'Registers a new user', type: RegisterResponseAPI})
    async register(@Body(ValidationPipe) authRegisterDto: AuthRegisterDto): Promise<RegisterResponseType> {
        return await this.authService.register(authRegisterDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Login a user'})
    @ApiResponse({status: 200, description: 'Logs in a user', type: RegisterResponseAPI})
    async login(@Body(ValidationPipe) authLoginDto: AuthLoginDto) {
        return await this.authService.login(authLoginDto);
    }

    @Post('autologin')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Autologin a user'})
    @ApiResponse({status: 200, description: 'Autologins a user', type: RegisterResponseAPI})
    async autologin(
        @Req() req,
        @Body(ValidationPipe) authAutologinDto: AuthAutologinDto
    ) {
        const accessToken = extractToken(req);
        validateAccessTokenUserId(this.jwtService, accessToken, authAutologinDto.id);
        return await this.authService.autologin(accessToken, authAutologinDto.id);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Logout a user'})
    @ApiResponse({status: 200, description: 'Logs out a user', type: String})
    async logout(
        @Req() req,
        @Body(ValidationPipe) authLogoutDto: AuthLogoutDto
    ) {
        const accessToken = extractToken(req);
        validateAccessTokenUserId(this.jwtService, accessToken, authLogoutDto.id);
        return await this.authService.logout(authLogoutDto.id);
    }


    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt-refresh'))
    @ApiOperation({summary: 'Refresh a user token'})
    @ApiResponse({status: 200, description: 'Refreshes a user token', type: TokensResponseAPI})
    async refresh(@Req() req, @Body(ValidationPipe) authRefreshDto: AuthRefreshDto) {
        const refreshToken = extractToken(req);
        validateRefreshTokenUserId(this.jwtService, refreshToken, authRefreshDto.id);
        return await this.authService.refresh(authRefreshDto.id, refreshToken);
    }
}
