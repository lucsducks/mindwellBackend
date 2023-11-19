import {IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ResendUserDto {
    @IsString()
    @IsEmail()
    email: string;

}
