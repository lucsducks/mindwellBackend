import { PartialType } from '@nestjs/swagger';
import { CreateHistorialrespuestaDto } from './create-historialrespuesta.dto';

export class UpdateHistorialrespuestaDto extends PartialType(CreateHistorialrespuestaDto) {}
