import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserAlertAPI {
    @ApiProperty({ example: 'groupName123', description: 'The name of the group related to the alert' })
    groupName: string;

    @ApiProperty({ example: 'Alert message here', description: 'The alert message' })
    message: string;

    @ApiProperty({ example: 'info', description: 'The type of the alert (info, success, error)' })
    type: string;

    @ApiProperty({ example: 1, description: 'The unique identifier of the alert' })
    id: number;
}

