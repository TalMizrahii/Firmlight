import { IsBoolean, IsNotEmpty, IsString} from "class-validator";

export class SendAnswerGroupDto {

    @IsString()
    @IsNotEmpty()
    userID: string;

    @IsString()
    @IsNotEmpty()
    groupID: string;

    @IsNotEmpty()
    @IsBoolean()
    answer: boolean;
}