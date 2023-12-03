import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TestpsicologicosService } from './testpsicologicos.service';
import { CreateTestpsicologicoDto } from './dto/create-testpsicologico.dto';
import { UpdateTestpsicologicoDto } from './dto/update-testpsicologico.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Controller('testpsicologicos')
@Auth()
@Auth(ValidRoles.psicologo,ValidRoles.admin)
export class TestpsicologicosController {
  constructor(private readonly testpsicologicosService: TestpsicologicosService) {}

  @Post()
  create(@Body() createTestpsicologicoDto: CreateTestpsicologicoDto, @GetUser() user: User) {
    return this.testpsicologicosService.create(createTestpsicologicoDto,user);
  }

  @Get()
  findAll() {
    return this.testpsicologicosService.findAll();
  }
  
  @Get('/psicologo/:usuarioId')
  findAllPsicologo(@Param('usuarioId',ParseUUIDPipe) usuarioId: string) {
    return this.testpsicologicosService.findAllPsicologo(usuarioId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testpsicologicosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateTestpsicologicoDto: UpdateTestpsicologicoDto, @GetUser() user: User) {
    return this.testpsicologicosService.update(id, updateTestpsicologicoDto,user);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.testpsicologicosService.remove(id);
  }
}
