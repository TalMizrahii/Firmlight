import {IsNotEmpty, IsString} from "class-validator";

export class GetTaskMetadata{
    @IsString()
    @IsNotEmpty()
    taskID: string;

    @IsString()
    @IsNotEmpty()
    userID: string;
}