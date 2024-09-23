import {IsBoolean, IsNotEmpty, IsString} from "class-validator";

export class StarGroupDto {
    @IsString()
    @IsNotEmpty()
    userID: string;

    @IsBoolean()
    @IsNotEmpty()
    status: boolean;
}