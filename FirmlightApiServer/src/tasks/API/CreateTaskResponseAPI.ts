import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TaskStatistics {
    @ApiProperty({ example: 'PROGRESS', description: 'Status of the task for the user' })
    status: 'PROGRESS' | 'FINISHED' | 'FAILED';

    @ApiProperty({ example: '2024-09-15T12:00:00Z', description: 'Start time of the task' })
    startTime: string;

    @ApiPropertyOptional({ example: '2024-09-15T14:00:00Z', description: 'Finish time of the task (optional)' })
    finishTime?: string;

    @ApiProperty({ example: 75, description: 'Percentage of task completion' })
    percentage: number;

    @ApiProperty({ example: 'john_doe', description: 'Username of the worker' })
    workerUsername: string;
}

export class CreateTaskResponseAPI {
    @ApiProperty({ example: 'task123', description: 'Unique identifier for the task' })
    taskId: string;

    @ApiProperty({ example: 'Sample Task', description: 'Title of the task' })
    title: string;

    @ApiProperty({ example: 'This is a detailed description of the task.', description: 'Description of the task' })
    description: string;

    @ApiProperty({ example: 'PROGRESS', enum: ['FAILED', 'PROGRESS', 'SUCCESS'], description: 'Current status of the task' })
    status: 'FAILED' | 'PROGRESS' | 'SUCCESS';

    @ApiPropertyOptional({ example: '2024-09-15T12:00:00Z', description: 'Creation date of the task (optional)' })
    created?: string;

    @ApiProperty({
        type: 'object',
        additionalProperties: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: ['PROGRESS', 'FINISHED', 'FAILED'] },
                startTime: { type: 'string', format: 'date-time' },
                finishTime: { type: 'string', format: 'date-time', nullable: true },
                percentage: { type: 'number' },
                workerUsername: { type: 'string' },
            },
            required: ['status', 'startTime', 'percentage', 'workerUsername']
        },
        description: 'Statistics for each user involved in the task',
    })
    statistics: Record<string, TaskStatistics>;

    @ApiProperty({ example: 'creator123', description: 'ID of the task creator' })
    creatorID: string;

    @ApiProperty({ example: 'creator_username', description: 'Username of the task creator' })
    creatorUsername: string;
}
