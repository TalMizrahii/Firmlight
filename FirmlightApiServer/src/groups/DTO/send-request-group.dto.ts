import {IsArray, IsNotEmpty, IsString} from "class-validator";

export class SendRequestGroupDto {

    @IsString()
    @IsNotEmpty()
    creatorID: string;

    @IsString()
    @IsNotEmpty()
    groupID: string;

    @IsArray()
    @IsString({ each: true }) // Validate each item in the array as a string.
    requests: string[];
}