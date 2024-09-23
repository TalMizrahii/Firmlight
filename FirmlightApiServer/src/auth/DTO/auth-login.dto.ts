import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
    @IsString()
    @IsNotEmpty()
    usernameOrEmail: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}