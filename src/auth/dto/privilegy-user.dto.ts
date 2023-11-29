import {IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class PrivilegyUserDto {
    @IsString()
    @IsEnum(['user','admin','docente'],{message:'El rol debe ser user, admin o docente'})
    role: string;

}
