import { IsString, IsOptional, IsEmail, Length } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(6, 25)
    readonly username?: string;

    @IsOptional()
    @IsEmail()
    readonly email?: string;

    @IsOptional()
    @IsString()
    @Length(8, 1000)
    readonly password?: string;
}
