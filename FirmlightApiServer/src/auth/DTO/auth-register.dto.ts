import {IsEmail, IsNotEmpty, IsString, Length, Matches} from 'class-validator';

export class AuthRegisterDto {
    @IsString()
    @Length(6, 20, {message: 'Username must be between 6 and 20 characters.'})
    username: string;

    @IsEmail({}, {message: 'Invalid email format.'})
    email: string;

    @IsString()
    @Length(8, undefined, {message: 'Password must be at least 8 characters long.'})
    @Matches(/(?=.*[a-zA-Z])(?=.*\d)/, {message: 'Password must contain both letters and at least one number.'})
    password: string;
}