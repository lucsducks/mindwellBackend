import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  MinLength,
} from 'class-validator';

export class CreateTestpsicologicoDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
  @IsString()
  @IsOptional()
  reglasInterpretacion?: string;
  @IsString()
  tipoTest: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(300)
  duracionEstimada?: number;

  @IsOptional()
  @IsString()
  edadObjetivo?: string;
}
