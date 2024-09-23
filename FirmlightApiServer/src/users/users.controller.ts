import {
    Controller,
    Get,
    Body,
    Param,
    Patch,
    Delete,
    ValidationPipe,
    HttpCode,
    HttpStatus,
    UseGuards, Req
} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from './DTO';
import {AuthGuard} from "@nestjs/passport";
import {JwtService} from '@nestjs/jwt';
import {extractToken, validateAccessTokenUserId} from '../auth/utils/auth.utils';
import {GroupRequest} from "./Schemas/User.schema";
import {AlertsUserType, ResponseUserType} from "./Types";
import {ApiTags, ApiOperation, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {ResponseUserAPI} from "./API/ResponseUserAPI";
import {UserAlertAPI} from "./API/userAlertsAPI";

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService) {
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Returns all users'})
    @ApiResponse({status: 200, description: 'Returns all users', type: [ResponseUserAPI]})
    async findAll(): Promise<ResponseUserType[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Returns a user by ID'})
    @ApiResponse({status: 200, description: 'Returns a user by ID', type: ResponseUserAPI})
    async findOne(@Param('id', ValidationPipe) id: string): Promise<ResponseUserType> {
        return this.usersService.findOne(id);
    }


    @Patch(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Update a user'})
    @ApiResponse({status: 200, description: 'Updates a user', type: ResponseUserAPI})
    async update(
        @Req() request: Request,
        @Param('id', ValidationPipe) id: string,
        @Body(ValidationPipe) userUpdateDto: UpdateUserDto): Promise<ResponseUserType> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, id);
        return this.usersService.update(id, userUpdateDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Delete a user'})
    @ApiResponse({status: 200, description: 'Deletes a user', type: ResponseUserAPI})
    async delete(
        @Req() request: Request,
        @Param('id', ValidationPipe) id: string): Promise<ResponseUserType> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, id);
        return this.usersService.delete(id);
    }

    @Get(':id/notifications')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Get notifications for a user'})
    @ApiResponse({status: 200, description: 'Get notifications for a user', type: [GroupRequest]})
    async getNotifications(
        @Req() request: Request,
        @Param('id', ValidationPipe) id: string): Promise<GroupRequest[]> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, id);
        return this.usersService.getNotifications(id);
    }

    @Get(':id/alerts')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Get alerts for a user'})
    @ApiResponse({status: 200, description: 'Get alerts for a user', type: [UserAlertAPI]})
    async getAlerts(
        @Req() request: Request,
        @Param('id', ValidationPipe) id: string): Promise<AlertsUserType> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, id);
        return this.usersService.getAlerts(id);
    }

    @Delete(':id/alerts/:alertId')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Delete an alert for a user'})
    @ApiResponse({status: 200, description: 'Delete an alert for a user', type: UserAlertAPI})
    async deleteAlert(
        @Req() request: Request,
        @Param('id', ValidationPipe) id: string,
        @Param('alertId', ValidationPipe) alertId: number): Promise<AlertsUserType> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, id);
        return this.usersService.deleteAlert(id, alertId);
    }

    @Delete(':id/alerts')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Delete all alerts for a user'})
    @ApiResponse({status: 200, description: 'Delete all alerts for a user', type: [UserAlertAPI]})
    async deleteAllAlerts(
        @Req() request: Request,
        @Param('id', ValidationPipe) id: string): Promise<AlertsUserType> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, id);
        return this.usersService.deleteAllAlerts(id);
    }
}
