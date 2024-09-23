import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseAPI {
    @ApiProperty({ example: 'userId123', description: 'The unique identifier of the user' })
    id: string;

    @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
    username: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
    email: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', description: 'The access token for the user' })
    accessToken: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', description: 'The refresh token for the user' })
    refreshToken: string;
}
