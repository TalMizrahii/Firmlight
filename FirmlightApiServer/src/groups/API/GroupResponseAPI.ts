import { ApiProperty } from '@nestjs/swagger';

export class GroupResponseAPI {
    @ApiProperty({ example: '123', description: 'The ID of the group' })
    id: string;

    @ApiProperty({ example: 'Group Name', description: 'The name of the group' })
    name: string;

    @ApiProperty({ example: ['user1', 'user2'], description: 'The members of the group' })
    members: string[];

    @ApiProperty({ example: false, description: 'Whether the group is starred' })
    isStarred: boolean;
}
