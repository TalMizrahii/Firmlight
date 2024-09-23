import {IsNotEmpty,  IsString} from 'class-validator';

export class AuthLogoutDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}
