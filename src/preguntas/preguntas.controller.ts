import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('preguntas')
@Auth()
export class PreguntasController {
  constructor(private readonly preguntasService: PreguntasService) {}

  @Post()

  create(@Body() createPreguntaDto: CreatePreguntaDto[], @GetUser() user: User) {
    return this.preguntasService.create(createPreguntaDto,user);
  }

  @Get()
  findAll() {
    return this.preguntasService.findAll();
  }
  @Get('test/:id')
  findAllTest(@Param('id',ParseUUIDPipe) id: string) {
    return this.preguntasService.findAllTest(id);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preguntasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updatePreguntaDto: UpdatePreguntaDto,@GetUser() user: User) {
    return this.preguntasService.update(id, updatePreguntaDto,user);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.preguntasService.remove(id);
  }
}
