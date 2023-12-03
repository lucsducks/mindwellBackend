import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHistorialrespuestaDto } from './dto/create-historialrespuesta.dto';
import { UpdateHistorialrespuestaDto } from './dto/update-historialrespuesta.dto';
import { HistorialRespuesta } from './entities/historialrespuesta.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pregunta } from 'src/preguntas/entities/pregunta.entity';
import { TestPsicologico } from 'src/testpsicologicos/entities/testpsicologico.entity';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class HistorialrespuestasService {
  constructor(
    @InjectRepository(HistorialRespuesta)
    private readonly historialrespuestaRepository: Repository<HistorialRespuesta>,
    @InjectRepository(Pregunta)
    private readonly preguntaRepository: Repository<Pregunta>,
    @InjectRepository(TestPsicologico)
    private readonly testPsicologicoRepository: Repository<TestPsicologico>
  ) {}
  async create(createHistorialrespuestasDto: CreateHistorialrespuestaDto[]) {
    const sessionId = uuidv4(); // Genera un nuevo UUID para esta sesión de test
    const historialRespuestas = [];
  
    for (const dto of createHistorialrespuestasDto) {
      const pregunta = await this.preguntaRepository.findOneBy({ id: dto.pregunta });
      if (!pregunta) throw new BadRequestException('No existe la pregunta');
  

      const historialrespuesta = new HistorialRespuesta();
      historialrespuesta.pregunta = pregunta;
      historialrespuesta.respuesta = dto.respuesta;
      historialrespuesta.sessionId = sessionId; 
  
      historialRespuestas.push(historialrespuesta);
    }
  
    return this.historialrespuestaRepository.save(historialRespuestas);
  }

  async findAll() {
    return await this.historialrespuestaRepository.find({relations: ['pregunta', 'pregunta.testPsicologico']});
  }
  

  async findOne(sessionId: string) {
    return await this.historialrespuestaRepository.find({
      where: { sessionId },
      relations: ['pregunta', 'pregunta.testPsicologico'],
    });
  }
  
  //# No tendria por que hacer esto si se supone que el historial de respuestas es inmutable
  update(id: number, updateHistorialrespuestaDto: UpdateHistorialrespuestaDto) {
  }

  remove(id: number) {
    return `This action removes a #${id} historialrespuesta`;
  }
}
