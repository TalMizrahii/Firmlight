import {Controller, Post, Body, UseGuards, Req, ValidationPipe} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {AuthGuard} from '@nestjs/passport';
import {JwtService} from '@nestjs/jwt';
import {extractToken, validateAccessTokenUserId} from '../auth/utils/auth.utils';
import {CreateTaskDto} from "./DTO/create-task.dto";
import {TaskMetadata} from "../groups/Types";
import {ApiTags, ApiOperation, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {CreateTaskResponseAPI} from "./API/CreateTaskResponseAPI";

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
        private jwtService: JwtService,
    ) {
    }


    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Returns all users'})
    @ApiResponse({status: 200, description: 'Returns all users', type: CreateTaskResponseAPI})
    async createTask(@Req() req, @Body(ValidationPipe) createTaskDto: CreateTaskDto): Promise<TaskMetadata> {
        const token = extractToken(req);
        validateAccessTokenUserId(this.jwtService, token, createTaskDto.creatorID);
        return this.tasksService.createTask(
            createTaskDto.groupID,
            createTaskDto.creatorID,
            createTaskDto.creatorUsername,
            createTaskDto.title,
            createTaskDto.type,
            createTaskDto.data,
            createTaskDto.description
        );
    }
}
