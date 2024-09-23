import {IsNotEmpty,  IsString} from 'class-validator';

export class AuthAutologinDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}
