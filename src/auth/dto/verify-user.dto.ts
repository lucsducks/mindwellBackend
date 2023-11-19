import {IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class VerifyUserDto {
    @IsString()
    @IsEmail()
    email: string;
    @IsString()
    @MinLength(1)
    code: string;

}
