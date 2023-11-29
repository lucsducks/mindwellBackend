import { IsUUID } from "class-validator";

export class CreatePacienteDto {
    @IsUUID()
    psicologo: string;
    @IsUUID()
    paciente: string;
}
