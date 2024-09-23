import {ApiProperty} from "@nestjs/swagger";

export class TokensResponseAPI {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}