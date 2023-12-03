import { PartialType } from '@nestjs/swagger';
import { CreateTestpsicologicoDto } from './create-testpsicologico.dto';

export class UpdateTestpsicologicoDto extends PartialType(CreateTestpsicologicoDto) {}
