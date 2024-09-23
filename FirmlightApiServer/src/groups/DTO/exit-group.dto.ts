import {IsNotEmpty, IsString} from "class-validator";

export class ExitGroupDto {

    @IsString()
    @IsNotEmpty()
    userID: string;
}