import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {UpdateUserDto} from './DTO';
import {ResponseUserType,AlertsUserType} from './Types';
import {GroupRequest, User} from './Schemas/User.schema';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class UsersService {
    /**
     * Constructor for the UsersService.
     * @param userModel The user model.
     */
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
    }

    /**
     * Get all users.
     */
    async findAll(): Promise<ResponseUserType[]> {
        const users = await this.userModel.find().exec();
        console.log("All users where asked");
        return users.map(user => this.buildUserResponse(user));
    }

    /**
     * Find a user by ID.
     * @param id The user ID.
     */
    async findOne(id: string): Promise<ResponseUserType> {
        const user = await this.userModel.findOne({id}).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.buildUserResponse(user);
    }

    /**
     * Update a user.
     * @param id The user ID.
     * @param updatedUserDto The updated user DTO.
     */
    async update(id: string, updatedUserDto: UpdateUserDto): Promise<ResponseUserType> {
        const user = await this.userModel.findOne({id}).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const existingUser = await this.userModel.findOne({
            $or: [{email: updatedUserDto.email}, {username: updatedUserDto.username}],
            id: {$ne: id}
        }).exec();

        if (existingUser) {
            if (existingUser.email === updatedUserDto.email) {
                throw new ConflictException('Email already in use');
            }
            if (existingUser.username === updatedUserDto.username) {
                throw new ConflictException('Username already in use');
            }
        }

        const updatedUser = await this.userModel.findOneAndUpdate({id}, updatedUserDto, {new: true}).exec();
        return this.buildUserResponse(updatedUser);
    }

    /**
     * Delete a user.
     * @param id The user ID.
     */
    async delete(id: string): Promise<ResponseUserType> {
        const deletedUser = await this.userModel.findOneAndDelete({id:id}).exec();
        if (!deletedUser) {
            throw new NotFoundException('User not found');
        }
        return this.buildUserResponse(deletedUser);
    }

    /**
     * Get all notifications for a user.
     * @param userId The user ID.
     */
    async getNotifications(userId: string): Promise<GroupRequest[]> {
        try {
            const user = await this.userModel.findOne({id: userId})
                .select("+groupRequests")
                .lean()  // Ensure result is plain JS object
                .exec();

            if (!user) {
                throw new NotFoundException('User not found');
            }

            return user.groupRequests ? user.groupRequests : [];
        } catch (e) {
            console.error(e);
            throw new NotFoundException('User not found');
        }
    }

    /**
     * Get all alerts for a user.
     * @param userId The user ID.
     */
    async getAlerts(userId: string): Promise<AlertsUserType> {
        try {
            const user = await this.userModel.findOne({id: userId}).exec();
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return {alerts: user.alerts};
        } catch (e) {
            console.error(e);
            throw new NotFoundException('User not found');
        }
    }

    /**
     * Delete an alert for a user.
     * @param userId The user ID.
     * @param alertId The alert ID.
     */
    async deleteAlert(userId: string, alertId: string | number): Promise<AlertsUserType> {
        // Ensure alertId is a number.
        const parsedAlertId = Number(alertId);
        // Check if alertId is a valid number.
        if (parsedAlertId > Date.now() || parsedAlertId < 0) {
            throw new NotFoundException('Alert not found');
        }
        try {
            const user = await this.userModel.findOne({ id: userId }).exec();
            if (!user) {
                throw new NotFoundException('User not found');
            }
            // Compare both as numbers.
            user.alerts = user.alerts.filter(alert => alert.id !== parsedAlertId);
            // Save the user.
            await user.save();
            return { alerts: user.alerts };
        } catch (e) {
            console.error(e);
            throw new NotFoundException('User not found');
        }
    }

    /**
     * Delete all alerts for a user.
     * @param userId The user ID.
     */
    async deleteAllAlerts(userId: string): Promise<AlertsUserType> {
        try {
            const user = await this.userModel.findOne({id: userId}).exec();
            if (!user) {
                throw new NotFoundException('User not found');
            }
            user.alerts = [];
            await user.save();
            return {alerts: user.alerts};
        } catch (e) {
            console.error(e);
            throw new NotFoundException('User not found');
        }
    }

    /**
     * Build a user response.
     * @param user The user.
     * @private
     */
    private buildUserResponse(user: User): ResponseUserType {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
        };
    }
}
