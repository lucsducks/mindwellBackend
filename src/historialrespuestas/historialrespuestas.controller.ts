import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialrespuestasService } from './historialrespuestas.service';
import { CreateHistorialrespuestaDto } from './dto/create-historialrespuesta.dto';
import { UpdateHistorialrespuestaDto } from './dto/update-historialrespuesta.dto';

@Controller('historialrespuestas')
export class HistorialrespuestasController {
  constructor(private readonly historialrespuestasService: HistorialrespuestasService) {}

  @Post()
  create(@Body() createHistorialrespuestaDto: CreateHistorialrespuestaDto[]) {
    return this.historialrespuestasService.create(createHistorialrespuestaDto);
  }

  @Get()
  findAll() {
    return this.historialrespuestasService.findAll();
  }

  @Get(':sessionId')
  findOne(@Param('sessionId') sessionId: string) {
    return this.historialrespuestasService.findOne(sessionId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialrespuestaDto: UpdateHistorialrespuestaDto) {
    return this.historialrespuestasService.update(+id, updateHistorialrespuestaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialrespuestasService.remove(+id);
  }
}
