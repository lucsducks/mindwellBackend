import {  IsString, IsUUID, MinLength } from "class-validator";

export class CreateHistorialrespuestaDto {
    @IsString()
    @MinLength(1)
    respuesta: string;

    @IsUUID()  
    pregunta: string;
}
