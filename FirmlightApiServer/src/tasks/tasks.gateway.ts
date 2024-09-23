import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {TasksService} from "./tasks.service";
import {JwtService} from "@nestjs/jwt";
import {GroupsService} from "../groups/groups.service";

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['authorization', 'Content-Type'],
    },
    transports: ['websocket', 'polling'],
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
    // The WebSocket server instance.
    @WebSocketServer()
    server: Server;
    // Map to store task assignments for disconnected users.
    private taskAssignments: Map<string, {
        taskId: string,
        chunk: any,
        percentage: number,
        groupID: string
    }[]> = new Map();

    /**
     * Constructor for TasksGateway.
     * @param groupsService - The GroupsService instance.
     * @param tasksService - The TasksService instance.
     * @param jwtService - The JwtService instance.
     */
    constructor(
        private readonly groupsService: GroupsService,
        private tasksService: TasksService,
        private jwtService: JwtService,
    ) {
    }

    /**
     * Handles a new connection to the WebSocket server.
     * @param client - The client socket.
     */
    async handleConnection(client: Socket) {
        // Verify the access token.
        const accessToken = client.handshake.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            client.disconnect();
            return;
        }
        // Get the user ID and username from the access token.
        try {
            // Verify the access token.
            const payload = this.jwtService.verify(accessToken, {secret: process.env.JWT_AT_SECRET});
            // Get the user ID and username from the payload.
            const userId = payload.userID;
            const username = payload.sub;
            // Store the user ID in the client data.
            client.data.userId = userId;
            client.data.username = username;
            // Add the user to the connected users list.
            await this.tasksService.addConnectedUser(userId, client);
            console.log(`User connected: ${username} (${userId})`);
        } catch (error) {
            console.log(`Error verifying token: ${error}`);
            client.disconnect();
        }
    }

    /**
     * Handles a disconnection from the WebSocket server.
     * @param client - The client socket.
     */
    async handleDisconnect(client: Socket) {
        const userId = client.data.userId;
        if (userId) {
            await this.tasksService.removeConnectedUser(userId);
            console.log(`User disconnected: ${userId}`);

            const assignedTasks = this.taskAssignments.get(userId);
            if (assignedTasks) {
                for (const assignedTask of assignedTasks) {
                    await this.handleWorkerFailure(userId, assignedTask);
                }
                this.taskAssignments.delete(userId);
            }
        }
    }

    async handleWorkerFailure(userId: string, assignedTask: {
        taskId: string,
        chunk: any,
        percentage: number,
        groupID: string
    }) {
        const {taskId, chunk, percentage, groupID} = assignedTask;

        // Update failed worker's statistics
        await this.groupsService.updateTaskWorkerStatistics(
            groupID,
            taskId,
            userId,
            'FAILED',
            undefined,
            0
        );

        // Redistribute the task
        await this.redistributeTask(taskId, chunk, percentage);
    }

    /**
     * Handles a task result message from a worker.
     * @param data - The task result data.
     * @param client - The client socket.
     */
    @SubscribeMessage('taskResult')
    async handleTaskResult(@MessageBody() data: { taskId: string, result: any }, @ConnectedSocket() client: Socket) {
        const userId = client.data.userId;
        const assignedTasks = this.taskAssignments.get(userId);

        if (!assignedTasks) {
            console.log(`No assigned tasks found for user ${userId}`);
            return;
        }

        // Find the corresponding task
        const assignedTaskIndex = assignedTasks.findIndex(task => task.taskId === data.taskId);
        if (assignedTaskIndex === -1) {
            console.log(`No assigned task found for taskId ${data.taskId} for user ${userId}`);
            return;
        }

        const assignedTask = assignedTasks[assignedTaskIndex];
        assignedTasks.splice(assignedTaskIndex, 1); // Remove the task from user's assignments

        const {
            isComplete,
            aggregatedResult,
            taskData
        } = await this.tasksService.addTaskResult(data.taskId, data.result);

        await this.groupsService.updateTaskWorkerStatistics(
            taskData.task.groupID,
            taskData.task.id,
            userId,
            'FINISHED',
            client.data.username
        );

        console.log(`Task result received from worker`);

        if (!isComplete) return;

        const creatorSocket = this.tasksService.getSocket(taskData.task.creatorID);
        if (!creatorSocket) {
            console.log(`Creator ${taskData.task.creatorID} not connected`);
            return;
        }

        const result = {
            taskId: taskData.task.id,
            result: aggregatedResult
        };

        if (taskData.task.type == "MEAN") {
            creatorSocket.emit('meanTaskComplete', result);
            console.log(`Mean task ${taskData.task.id} complete, final result will be aggregated by the creator`);
            return;
        }

        creatorSocket.emit('taskCompleted', result);
        console.log(`Task ${taskData.task.id} complete`);
    }

    /**
     * Distributes a task to the connected workers.
     * @param chunks - The task chunks.
     * @param taskData - The full task data.
     */
    async distributeTask(chunks: any[], taskData: any) {
        const connectedWorkers = await this.tasksService.getConnectedUsersInGroup(taskData.groupID);

        if (connectedWorkers.length > 0 && connectedWorkers.length >= chunks.length) {
            chunks.forEach((chunk, index) => {
                const userId = connectedWorkers[index % connectedWorkers.length];
                const socket = this.tasksService.getSocket(userId);
                if (socket) {
                    socket.emit('newTask', {
                        taskChunk: chunk.data,
                        fullTaskData: taskData
                    });

                    // Store multiple task assignments for the user
                    const userTasks = this.taskAssignments.get(userId) || [];
                    userTasks.push({
                        taskId: taskData.id,
                        chunk: chunk.data,
                        percentage: chunk.percentage,
                        groupID: taskData.groupID
                    });
                    this.taskAssignments.set(userId, userTasks);

                    this.groupsService.updateTaskWorkerStatistics(
                        taskData.groupID,
                        taskData.id,
                        userId,
                        'PROGRESS',
                        socket.data.username,
                        chunk.percentage
                    );
                }
            });
        } else {
            await this.groupsService.updateTaskStatus(taskData.groupID, taskData.id, 'FAILED');
            console.log(`No available users in group ${taskData.groupID} to process task`);
        }
    }

    async redistributeTask(taskId: string, chunk: any, percentage: number) {
        const taskData = this.tasksService.getTaskData(taskId);
        if (!taskData) {
            await this.groupsService.updateTaskStatus(chunk.groupID, taskId, 'FAILED');
            console.log(`Task ${taskId} not found for redistribution`);
            return;
        }

        const connectedWorkers = await this.tasksService.getConnectedUsersInGroup(taskData.task.groupID);
        // const availableWorkers = connectedWorkers.filter(workerId => !this.taskAssignments.has(workerId));

        if (connectedWorkers.length > 0) {
            const workerId = connectedWorkers[0];
            const socket = this.tasksService.getSocket(workerId);
            if (socket) {
                socket.emit('newTask', {
                    taskChunk: chunk,
                    fullTaskData: taskData.task
                });

                // Store new task assignment
                const userTasks = this.taskAssignments.get(workerId) || [];
                userTasks.push({taskId, chunk, percentage, groupID: taskData.task.groupID});
                this.taskAssignments.set(workerId, userTasks);

                await this.groupsService.updateTaskWorkerStatistics(
                    taskData.task.groupID,
                    taskId,
                    workerId,
                    'PROGRESS',
                    socket.data.username,
                    percentage,
                    true // Indicates this is due to a redistribution
                );

                console.log(`Task ${taskId} redistributed to worker ${workerId}`);
            }
        } else {
            await this.groupsService.updateTaskStatus(taskData.task.groupID, taskId, 'FAILED');
            console.log(`No available workers to redistribute task ${taskId}`);
        }
    }
}