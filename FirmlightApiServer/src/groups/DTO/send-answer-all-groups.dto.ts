import { IsBoolean, IsNotEmpty, IsString} from "class-validator";

export class SendAnswerAllGroupsDto {

    @IsString()
    @IsNotEmpty()
    userID: string;

    @IsNotEmpty()
    @IsBoolean()
    answer: boolean;
}