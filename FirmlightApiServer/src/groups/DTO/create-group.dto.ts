import {IsNotEmpty, IsString, IsArray, IsOptional, Length} from "class-validator";
import {Optional} from "@nestjs/common";

export class CreateGroupDto {

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    creatorUsername: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 30, {message: 'Group name must be between 3 and 30 characters.'})
    groupName: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 120, {message: 'Description must be between 3 and 120 characters.'})
    description: string;

    @IsString()
    @IsOptional()
    created?: string;

    @IsArray()
    @IsOptional()  // Make the requests array optional
    @IsString({each: true})  // Ensure each item in the array is a string
    requests?: string[];  // Optional array of user IDs representing requests to join the group
}
