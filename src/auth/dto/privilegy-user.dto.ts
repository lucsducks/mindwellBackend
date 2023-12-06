import { IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class PrivilegyUserDto {
    @IsString()
    @IsEnum(['user', 'admin', 'paciente', 'psicologo'], { message: 'El rol debe ser user, admin,paciente o psicologo' })
    role: string;

    
}
