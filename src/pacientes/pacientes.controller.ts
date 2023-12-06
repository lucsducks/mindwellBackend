import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { TestDto } from 'src/pacientes/dto/test.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) { }

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(id);
  }
  @Get('psicologo/:id')
  findOnePacientes(@Param('id') psicologoId: string) {
    return this.pacientesService.findOnePacientes(psicologoId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(id, updatePacienteDto);
  }
  @Patch('/test/:id')
  updatePacienteTests(@Param('id') id: string, @Body() testDto: TestDto) {
    return this.pacientesService.updatePacienteTests(id, testDto);
  }

  @Delete(':idPaciente/test/:idTest')
  async eliminarTestDisponible(@Param('idPaciente',ParseUUIDPipe) idPaciente: string, @Param('idTest',ParseUUIDPipe) idTest: string) {
    return this.pacientesService.eliminarTestDisponible(idPaciente, idTest);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(id);
  }
}
