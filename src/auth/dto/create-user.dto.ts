import { IsArray, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(1)
    name: string;
    @IsString()
    @MinLength(1)
    lastname: string;
    @IsString()
    @IsOptional()
    levelEducation?: string;
    @IsString()
    @IsEmail()
    email: string;
    @IsString()
    @MinLength(6)
    @MaxLength(60)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{6,}$/, {
        message: 'the password must have an uppercase, a lowercase, a number, and optionally special characters',
    })
    password: string;


}
