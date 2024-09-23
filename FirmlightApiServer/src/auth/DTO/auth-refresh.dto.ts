import {IsNotEmpty,  IsString} from 'class-validator';

export class AuthRefreshDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}
