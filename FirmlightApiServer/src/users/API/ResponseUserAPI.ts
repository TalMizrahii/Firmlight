import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserAPI {
    @ApiProperty({ example: 'userId123', description: 'The unique identifier of the user' })
    id: string;

    @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
    username: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
    email: string;
}
