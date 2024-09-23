import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    groupID: string;

    @IsString()
    @IsNotEmpty()
    creatorID: string;

    @IsString()
    @IsNotEmpty()
    creatorUsername: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsOptional()
    data?: any;
}