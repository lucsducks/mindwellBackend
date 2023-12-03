import { IsArray, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreatePreguntaDto {
    @IsString()
    @MinLength(1)
    pregunta: string;
    @IsString()
    @MinLength(1)
    tipoRespuesta: string;
    @IsUUID()  
    testPsicologico: string;
    @IsString()
    @IsOptional()
    divisiondePregunta?: string;
    @IsArray()
    @IsOptional()
    respuestasposibles? : string[];
}
