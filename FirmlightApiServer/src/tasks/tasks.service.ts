import {Injectable} from '@nestjs/common';
import {InjectQueue} from '@nestjs/bull';
import {Queue} from 'bull';
import {InjectModel} from "@nestjs/mongoose";
import {Group} from "../groups/Schemas/Groups.schema";
import {Model} from "mongoose";
import {Socket} from 'socket.io';
import {TaskDataType} from "./Types/task-data.type";
import {FactorizationAggregator} from "./Factorization/factorization.aggregator";
import {MeanAggregator} from "./Mean/mean.aggregator";
import {CrawlerAggregator} from "./Crawling/crawler.aggregator";
import {Task} from "./Types/task.type";
import {GroupsService} from "../groups/groups.service";
import {TaskMetadata} from "../groups/Types";

@Injectable()
export class TasksService {
    // This service is used to manage tasks and their results. It is used by the TasksGateway to handle incoming task results and by the TasksController to create tasks.
    private tasks: Map<string, TaskDataType> = new Map();
    // This map is used to store connected sockets. It is used by the TasksGateway to handle incoming connections and disconnections.
    private connectedSockets: Map<string, Socket> = new Map();

    /**
     * Constructor for TasksService.
     * @param groupsService
     * @param tasksQueue - The Bull queue for tasks.
     * @param groupModel - The Mongoose model for groups.
     */
    constructor(
        private readonly groupsService: GroupsService,
        @InjectQueue('tasks') private tasksQueue: Queue,
        @InjectModel(Group.name) private groupModel: Model<Group>,
    ) {
    }

    /**
     * Creates a task with the given parameters.
     * @param groupID - The ID of the group the task belongs to.
     * @param creatorID - The ID of the user who created the task.
     * @param title - The title of the task.
     * @param type - The type of the task.
     * @param data - The data associated with the task.
     * @param description - The description of the task.
     * @param creatorUsername - The username of the user who created the task.
     */
    async createTask(groupID: string, creatorID: string, creatorUsername: string, title: string, type: string, data: any, description: string): Promise<TaskMetadata> {
        // Generate a unique task ID.
        const taskId = new Date().getTime().toString();
        try {
            // Create the task object.
            const task: Task = {id: taskId, groupID, creatorID, title, type, data};
            // Get the connected users in the group.
            const connectedWorkers = await this.getConnectedUsersInGroup(groupID);
            if (connectedWorkers.length === 0) {
                throw new Error(`No workers available in group ${groupID}`);
            }
            // Add the task to the tasks map.
            this.tasks.set(taskId, {
                task,
                results: [],
                totalWorkers: connectedWorkers.length,
                completedWorkers: 0,
                status: 'PROGRESS'
            });
            // Add the task to the group.
            const taskMetadata: TaskMetadata = {
                taskId: taskId,
                title: title,
                description: description,
                status: 'PROGRESS',
                created: new Date().toISOString(),
                statistics: {},
                creatorID: creatorID,
                creatorUsername: creatorUsername
            }
            await this.groupsService.addTaskToGroup(groupID, taskMetadata);
            // Log the task creation.
            console.log(`Created task ${taskId} for group ${groupID} with ${connectedWorkers.length} workers`);
            await this.tasksQueue.add('process_task', task, {
                removeOnComplete: true, // Automatically remove job after success.
                removeOnFail: true      // Automatically remove job after failure.
            });
            console.log(`Task ${taskId} added to queue`);
            return {
                taskId: taskMetadata.taskId,
                title: taskMetadata.title,
                description: taskMetadata.description,
                created: taskMetadata.created,
                status: taskMetadata.status,
                statistics: taskMetadata.statistics,
                creatorID: taskMetadata.creatorID,
                creatorUsername: taskMetadata.creatorUsername
            };
        } catch (error) {
            console.error(`Error creating task for group ${groupID}:`, error.message);
            this.tasks.delete(taskId);
        }
    }

    /**
     * Adds a task result to the task with the given ID.
     * @param taskId - The ID of the task.
     * @param result - The result to add.
     */
    async addTaskResult(taskId: string, result: any): Promise<{
        isComplete: boolean,
        aggregatedResult?: any,
        taskData: any
    }> {
        try {
            // Get the task data from the tasks map.
            const taskData = this.tasks.get(taskId);
            if (!taskData) {
                throw new Error(`Task ${taskId} not found`);
            }
            let response = null;
            switch (taskData.task.type) {
                case "FACTORIZATION":
                    response = await FactorizationAggregator.addFactorizationTaskResult(taskData, taskId, result, this.tasks);
                    if (response.isComplete) {
                        await this.groupsService.updateTaskStatus(taskData.task.groupID, taskId, 'SUCCESS');
                        this.tasks.delete(taskId);
                    }
                    return response;
                case "CRAWLER":
                    response = await CrawlerAggregator.addCrawlerTaskResult(taskData, taskId, result, this.tasks);
                    if (response.isComplete) {
                        await this.groupsService.updateTaskStatus(taskData.task.groupID, taskId, 'SUCCESS');
                        this.tasks.delete(taskId);
                    }
                    return response;
                case "MEAN":
                    response = await MeanAggregator.addMeanResult(taskData, taskId, result, this.tasks);
                    if (response.isComplete) {
                        await this.groupsService.updateTaskStatus(taskData.task.groupID, taskId, 'SUCCESS');
                        this.tasks.delete(taskId);
                    }
                    return response;
                default:
                    await this.groupsService.updateTaskStatus(taskData.task.groupID, taskId, 'FAILED');
                    this.tasks.delete(taskId);
                    throw new Error(`Task type ${taskData.task.type} not supported, task ${taskId} failed`);
            }
        } catch (error) {
            console.error(`Error adding task result for task ${taskId}:`, error);
        }
    }

    /**
     * Gets the connected users in the group with the given ID.
     * @param groupID - The ID of the group.
     */
    async getConnectedUsersInGroup(groupID: string): Promise<string[]> {
        try {
            const group = await this.groupModel.findOne({groupID: groupID});
            if (!group) {
                throw new Error(`Group ${groupID} not found`);
            }

            return group.members
                .filter(member => this.connectedSockets.has(member.userID))
                .map(member => member.userID);
        } catch (error) {
            console.error(`Error getting connected users in group ${groupID}:`, error);
            throw error;
        }
    }

    /**
     * Adds a connected user to the service.
     * @param userID - The ID of the user.
     * @param socket - The socket connection.
     */
    async addConnectedUser(userID: string, socket: Socket): Promise<void> {
        // Check if the user is already connected.
        if (this.connectedSockets.has(userID)) {
            throw new Error(`User ${userID} is already connected`);
        }
        this.connectedSockets.set(userID, socket);
    }

    /**
     * Removes a connected user from the service.
     * @param userID - The ID of the user.
     */
    async removeConnectedUser(userID: string): Promise<void> {
        // Check if the user is connected.
        if (!this.connectedSockets.has(userID)) {
            throw new Error(`User ${userID} is not connected`);
        }
        this.connectedSockets.delete(userID);
    }

    /**
     * Gets the socket connection for the user with the given ID.
     * @param userId
     */
    getSocket(userId: string): Socket {
        return this.connectedSockets.get(userId);
    }

    /**
     * Gets the task data for the task with the given ID.
     * @param taskId - The ID of the task.
     */
    getTaskData(taskId: string): TaskDataType {
        return this.tasks.get(taskId);
    }

    /**
     * Updates the total workers for the task with the given ID.
     * @param taskId - The ID of the task.
     * @param updatedTaskWorkersAmount - The updated total workers amount.
     */
    async updateTaskWorkers(taskId: string, updatedTaskWorkersAmount: number): Promise<void> {
        try {
            const taskData = this.tasks.get(taskId);
            if (!taskData) {
                throw new Error(`Task ${taskId} not found`);
            }
            taskData.totalWorkers = updatedTaskWorkersAmount;
            this.tasks.set(taskId, taskData);
        } catch (error) {
            console.error(`Error updating task workers for task ${taskId}:`, error);
        }
  }
}