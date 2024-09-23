import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    ValidationPipe,
    HttpCode,
    HttpStatus,
    UseGuards,
    Delete,
    Req
} from '@nestjs/common';
import {
    CreateGroupDto,
    ExitGroupDto,
    StarGroupDto,
    SendRequestGroupDto,
    SendAnswerGroupDto,
    SendAnswerAllGroupsDto,
    GetTaskMetadata
} from './DTO';
import {GroupsService} from './groups.service';
import {AuthGuard} from '@nestjs/passport';
import {GroupResponseType, TaskMetadata} from './Types';
import {JwtService} from '@nestjs/jwt';
import {extractToken, validateAccessTokenUserId} from '../auth/utils/auth.utils';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {GroupResponseAPI} from "./API/GroupResponseAPI";
import {TaskMetadataAPI} from "./API/TaskMetaDataAPI";

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService,
                private readonly jwtService: JwtService) {
    }

    @Get(':userId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Find all groups for a user' })
    @ApiResponse({ status: 200, description: 'Returns all groups for the user', type: [GroupResponseAPI] })
    async findAll(
        @Req() request: Request,
        @Param('userId', ValidationPipe) userId: string
    ): Promise<GroupResponseType[]> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, userId);
        return this.groupsService.findAllUserGroups(userId);
    }

    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new group' })
    @ApiResponse({ status: 201, description: 'Creates a new group', type: GroupResponseAPI })
    async create(@Body(ValidationPipe) createGroupDto: CreateGroupDto): Promise<GroupResponseType> {
        return this.groupsService.create(createGroupDto);
    }

    @Patch(':groupID/star')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Star or unstar a group' })
    @ApiResponse({ status: 200, description: 'The updated group', type: GroupResponseAPI })
    async star(
        @Req() request: Request,
        @Param('groupID', ValidationPipe) groupID: string,
        @Body(ValidationPipe) starGroupDto: StarGroupDto
    ): Promise<GroupResponseType> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, starGroupDto.userID);
        return this.groupsService.starGroup(groupID, starGroupDto.userID, starGroupDto.status);
    }

    @Get(':groupID/:userID')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Find one group for a user' })
    @ApiResponse({ status: 200, description: 'The requested group', type: GroupResponseAPI })
    async findOne(
        @Req() request: Request,
        @Param('groupID', ValidationPipe) groupID: string,
        @Param('userID', ValidationPipe) userID: string
    ): Promise<GroupResponseType> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, userID);
        return this.groupsService.findOne(groupID, userID);
    }

    @Patch(':groupID/exit')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Exit a group' })
    @ApiResponse({ status: 200, description: 'The updated group', type: GroupResponseAPI })
    async exitGroup(
        @Req() request: Request,
        @Param('groupID', ValidationPipe) groupID: string,
        @Body(ValidationPipe) exitGroupDto: ExitGroupDto
    ): Promise<GroupResponseType> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, exitGroupDto.userID);
        return this.groupsService.exitGroup(groupID, exitGroupDto.userID);
    }

    @Delete(':groupID/:userID')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Delete a group' })
    @ApiResponse({ status: 200, description: 'The group was deleted', type: Boolean })
    async deleteGroup(
        @Req() request: Request,
        @Param('groupID', ValidationPipe) groupID: string,
        @Param('userID', ValidationPipe) userID: string,
    ): Promise<boolean> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, userID);
        return this.groupsService.deleteGroup(groupID, userID);
    }

    @Post('request')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Send a request to join a group' })
    @ApiResponse({ status: 200, description: 'The updated group', type: [String]})
    async sendRequestGroup(
        @Req() request: Request,
        @Body(ValidationPipe) sendRequestGroupDto: SendRequestGroupDto
    ) {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, sendRequestGroupDto.creatorID);
        return this.groupsService.sendRequestGroup(
            sendRequestGroupDto.groupID,
            sendRequestGroupDto.creatorID,
            sendRequestGroupDto.requests);
    }

    @Post('answer')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Send an answer to a group request' })
    @ApiResponse({ status: 200, description: 'The updated group', type: GroupResponseAPI })
    async sendAnswerToGroup(
        @Req() request: Request,
        @Body(ValidationPipe) sendAnswerGroupDto: SendAnswerGroupDto
    ): Promise<GroupResponseType> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, sendAnswerGroupDto.userID);
        return this.groupsService.answerRequestGroup(
            sendAnswerGroupDto.groupID,
            sendAnswerGroupDto.userID,
            sendAnswerGroupDto.answer);
    }

    @Post('answerall')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Send an answer to all group requests' })
    @ApiResponse({ status: 200, description: 'The updated groups', type: [GroupResponseAPI] })
    async answersAllToGroup(
        @Req() request: Request,
        @Body(ValidationPipe) sendAnswerAllGroupDto: SendAnswerAllGroupsDto
    ): Promise<GroupResponseType[]> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, sendAnswerAllGroupDto.userID);
        return this.groupsService.sendAnswerAllGroupDto(
            sendAnswerAllGroupDto.userID,
            sendAnswerAllGroupDto.answer);
    }

    @Post(':groupID/task')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get task metadata' })
    @ApiResponse({ status: 200, description: 'The task metadata', type: TaskMetadataAPI })
    async getTaskMetadata(
        @Req() request: Request,
        @Body(ValidationPipe) getTaskDto: GetTaskMetadata,
        @Param('groupID', ValidationPipe) groupID: string,
    ): Promise<TaskMetadata> {
        const token = extractToken(request);
        validateAccessTokenUserId(this.jwtService, token, getTaskDto.userID);
        return this.groupsService.getTaskMetadata(groupID, getTaskDto.userID, getTaskDto.taskID);
    }

}
