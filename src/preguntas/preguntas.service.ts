import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';
import { Pregunta } from './entities/pregunta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestPsicologico } from 'src/testpsicologicos/entities/testpsicologico.entity';
import { User } from 'src/auth/entities/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class PreguntasService {

  constructor(
    @InjectRepository(Pregunta)
    private readonly preguntaRepository: Repository<Pregunta>,
    @InjectRepository(TestPsicologico)
    private readonly testPsicologicoRepository: Repository<TestPsicologico>
  ) { }
  async create(createPreguntasDto: CreatePreguntaDto[], user: User) {
    const preguntasParaGuardar = [];
    const errores = [];

    for (const dto of createPreguntasDto) {
        const existingPregunta = await this.preguntaRepository.createQueryBuilder('pregunta')
            .andWhere('pregunta.pregunta = :pregunta', { pregunta: dto.pregunta })
            .andWhere('pregunta.divisiondePregunta = :divisiondePregunta', { divisiondePregunta: dto.divisiondePregunta })
            .andWhere('pregunta.testPsicologico = :testPsicologico', { testPsicologico: dto.testPsicologico })
            .andWhere('pregunta.tipoRespuesta = :tipoRespuesta', { tipoRespuesta: dto.tipoRespuesta })
            .andWhere('pregunta.respuestasposibles = :respuestasposibles', { respuestasposibles: dto.respuestasposibles })
            .getOne();

        if (existingPregunta) {
            errores.push(`Pregunta con contenido "${dto.pregunta}" ya existe.`);
            continue;
        }

        const testPsicologico = await this.testPsicologicoRepository.findOneBy({ id: dto.testPsicologico });
        if (!testPsicologico) {
            errores.push(`Test psicológico con ID ${dto.testPsicologico} no existe para la pregunta "${dto.pregunta}".`);
            continue;
        }

        const pregunta = new Pregunta();
        pregunta.pregunta = dto.pregunta;
        pregunta.tipoRespuesta = dto.tipoRespuesta;
        pregunta.testPsicologico = testPsicologico;
        pregunta.divisiondePregunta = dto.divisiondePregunta;
        pregunta.respuestasposibles = dto.respuestasposibles;

        preguntasParaGuardar.push(pregunta);
    }

    if (preguntasParaGuardar.length > 0) {
        await this.preguntaRepository.save(preguntasParaGuardar);
    }

    return { preguntasGuardadas: preguntasParaGuardar.length, errores };
}


  async findAll() {
    return await this.preguntaRepository.find({
      relations: ['testPsicologico', 'respuestas'],
    });
  }
  async findAllTest(id: string) {
    return await this.preguntaRepository.find({
      where:{testPsicologico: {id: id}},
      relations: ['testPsicologico', 'respuestas'],
    });
  }

  async findOne(term: string) {
    let pregunta: Pregunta;

    if (isUUID(term)) {
      // Búsqueda por ID
      pregunta = await this.preguntaRepository.findOne({
        where: { id: term },
        relations: ['testPsicologico', 'respuestas'],
      });
    } else {
      // Búsqueda por texto de la pregunta
      pregunta = await this.preguntaRepository.findOne({
        where: { pregunta: term },
        relations: ['testPsicologico', 'respuestas'],
      });
    }

    if (!pregunta) {
      throw new BadRequestException('Pregunta no encontrada');
    }

    return pregunta;
  }


  async update(id: string, updatePreguntaDto: UpdatePreguntaDto, user: User) {
    const existingPregunta = await this.preguntaRepository.createQueryBuilder('pregunta')
      .andWhere('pregunta.pregunta = :pregunta', { pregunta: updatePreguntaDto.pregunta })
      .andWhere('pregunta.divisiondePregunta = :divisiondePregunta', { divisiondePregunta: updatePreguntaDto.divisiondePregunta })
      .andWhere('pregunta.testPsicologico = :testPsicologico', { testPsicologico: updatePreguntaDto.testPsicologico })
      .andWhere('pregunta.tipoRespuesta = :tipoRespuesta', { tipoRespuesta: updatePreguntaDto.tipoRespuesta })
      .andWhere('pregunta.respuestasposibles = :respuestasposibles', { respuestasposibles: updatePreguntaDto.respuestasposibles })
      .getOne();


    if (existingPregunta) {
      throw new BadRequestException('Ya existe una pregunta con el mismo contenido.');
    }

    // Encontrar y actualizar la pregunta
    const pregunta = await this.preguntaRepository.findOneBy({ id });
    if (!pregunta) {
      throw new BadRequestException('Pregunta no encontrada.');
    }

    pregunta.pregunta = updatePreguntaDto.pregunta;
    pregunta.tipoRespuesta = updatePreguntaDto.tipoRespuesta;
    pregunta.divisiondePregunta = updatePreguntaDto.divisiondePregunta;

    if (updatePreguntaDto.testPsicologico) {
      const testPsicologico = await this.testPsicologicoRepository.findOneBy({
        id: updatePreguntaDto.testPsicologico,
      });
      if (!testPsicologico) {
        throw new BadRequestException('No existe el test psicologico');
      }
      pregunta.testPsicologico = testPsicologico;
    }

    await this.preguntaRepository.save(pregunta);

    return pregunta;
  }

  async remove(id: string) {
    const existeTest = await this.preguntaRepository.findOneBy({ id });
    if (!existeTest) {
      throw new BadRequestException('No se encontró el test');
    }
    if (existeTest.isActive) {
      await this.preguntaRepository.update(id, { isActive: false });
      return { message: 'Test desactivado' };
    }
    else {
      await this.preguntaRepository.update(id, { isActive: true });
      return { message: 'Test activado' };
    }
  }
}
