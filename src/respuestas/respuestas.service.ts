import { Injectable } from '@nestjs/common';
import { CreateRespuestaDto } from './dto/create-respuesta.dto';
import { UpdateRespuestaDto } from './dto/update-respuesta.dto';
import { Respuesta } from './entities/respuesta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RespuestasService {
  constructor(
    @InjectRepository(Respuesta)
    private readonly respuestaRepository: Repository<Respuesta>,
  ) {}
  create(createRespuestaDto: CreateRespuestaDto) {
    return 'This action adds a new respuesta';
  }

  findAll() {
    return `This action returns all respuestas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} respuesta`;
  }

  update(id: number, updateRespuestaDto: UpdateRespuestaDto) {
    return `This action updates a #${id} respuesta`;
  }

  remove(id: number) {
    return `This action removes a #${id} respuesta`;
  }
}
