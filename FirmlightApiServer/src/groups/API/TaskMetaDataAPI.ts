import { ApiProperty } from '@nestjs/swagger';

class TaskStatistics {
    @ApiProperty({ example: 'PROGRESS', enum: ['PROGRESS', 'FINISHED', 'FAILED'], description: 'The current status of the task for the user' })
    status: 'PROGRESS' | 'FINISHED' | 'FAILED';

    @ApiProperty({ example: '2024-09-16T12:00:00Z', description: 'Start time of the task' })
    startTime: string;

    @ApiProperty({ example: '2024-09-16T13:00:00Z', description: 'Finish time of the task', required: false })
    finishTime?: string;

    @ApiProperty({ example: 75, description: 'Percentage of task completion' })
    percentage: number;

    @ApiProperty({ example: 'workerUsername', description: 'Username of the worker' })
    workerUsername: string;
}

export class TaskMetadataAPI {
    @ApiProperty({ example: 'taskId123', description: 'The ID of the task' })
    taskId: string;

    @ApiProperty({ example: 'Task Title', description: 'The title of the task' })
    title: string;

    @ApiProperty({ example: 'Task Description', description: 'The description of the task' })
    description: string;

    @ApiProperty({ example: 'SUCCESS', enum: ['FAILED', 'PROGRESS', 'SUCCESS'], description: 'The current status of the task' })
    status: 'FAILED' | 'PROGRESS' | 'SUCCESS';

    @ApiProperty({ example: '2024-09-16T12:00:00Z', description: 'Creation time of the task', required: false })
    created?: string;

    @ApiProperty({
        description: 'Statistics of the task for each user',
        type: 'object',
        additionalProperties: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: ['PROGRESS', 'FINISHED', 'FAILED'] },
                startTime: { type: 'string', format: 'date-time' },
                finishTime: { type: 'string', format: 'date-time', nullable: true },
                percentage: { type: 'number' },
                workerUsername: { type: 'string' }
            }
        }
    })
    statistics: Record<string, TaskStatistics>;

    @ApiProperty({ example: 'creatorId123', description: 'The ID of the creator' })
    creatorID: string;

    @ApiProperty({ example: 'creatorUsername', description: 'The username of the creator' })
    creatorUsername: string;
}
