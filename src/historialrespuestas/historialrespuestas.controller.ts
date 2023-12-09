import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HistorialrespuestasService } from './historialrespuestas.service';
import { CreateHistorialrespuestaDto } from './dto/create-historialrespuesta.dto';
import { UpdateHistorialrespuestaDto } from './dto/update-historialrespuesta.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { User } from 'src/auth/entities/user.entity';

@Controller('historialrespuestas')
@Auth()
export class HistorialrespuestasController {
  constructor(
    private readonly historialrespuestasService: HistorialrespuestasService,
  ) {}

  @Post()
  create(
    @Body() createHistorialrespuestaDto: CreateHistorialrespuestaDto[],
    @GetUser() user: User,
  ) {
    return this.historialrespuestasService.create(
      createHistorialrespuestaDto,
      user,
    );
  }

  @Get()
  findAll() {
    return this.historialrespuestasService.findAll();
  }

  @Get(':sessionId')
  findOne(@Param('sessionId') sessionId: string) {
    return this.historialrespuestasService.findOne(sessionId);
  }

  @Get('user/:idUser')
  findUniqueSessionsByUser(@Param('idUser') idUser: string) {
    return this.historialrespuestasService.findUniqueSessionsByUser(idUser);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHistorialrespuestaDto: UpdateHistorialrespuestaDto,
  ) {
    return this.historialrespuestasService.update(
      +id,
      updateHistorialrespuestaDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialrespuestasService.remove(+id);
  }
}
