import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestpsicologicoDto } from './dto/create-testpsicologico.dto';
import { UpdateTestpsicologicoDto } from './dto/update-testpsicologico.dto';
import { TestPsicologico } from './entities/testpsicologico.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class TestpsicologicosService {
  constructor(
    @InjectRepository(TestPsicologico)
    private testpsicologicoRepository: Repository<TestPsicologico>,
  ) { }
  async create(createTestpsicologicoDto: CreateTestpsicologicoDto, user: User) {
    const existeTest = await this.testpsicologicoRepository.findOneBy({ nombre: createTestpsicologicoDto.nombre });
    if (existeTest) {
      throw new ConflictException('Ya existe un test con ese nombre');
    }
    const nuevoTest = this.testpsicologicoRepository.create({ ...createTestpsicologicoDto, user });
    return await this.testpsicologicoRepository.save(nuevoTest);

  }

  findAll() {
    const testpsicologicos = this.testpsicologicoRepository.find();
    return testpsicologicos;
  }
  
  async findAllPsicologo(usuarioId: string) {
    return await this.testpsicologicoRepository.find({
      where: {
        user: { id: usuarioId }
      }
    });
  }
  

  async findOne(term: string) {
    let testPsicologicos: TestPsicologico[];
  
    if (isUUID(term)) {
      // Si es UUID, busca por ID
      const testPsicologico = await this.testpsicologicoRepository.findOne({
        where: { id: term },
        relations: ['user'],
      });
      if (testPsicologico) {
        testPsicologicos = [testPsicologico];
      }
    } else {
      // Si no es UUID, busca por semejanza
      const queryBuilder = this.testpsicologicoRepository.createQueryBuilder('test');
      queryBuilder.leftJoinAndSelect('test.user', 'user');
      testPsicologicos = await queryBuilder
        .where('UPPER(test.nombre) LIKE :nombre', { nombre: `%${term.toUpperCase()}%` })
        .getMany();
    }
  
    if (!testPsicologicos || testPsicologicos.length === 0) {
      throw new BadRequestException('Test Psicológico no encontrado');
    }
  
    return testPsicologicos;
  }
  
  


  async update(id: string, updateTestpsicologicoDto: UpdateTestpsicologicoDto, user: User) {
    // Verifica si existe un test con el mismo nombre pero diferente ID
    const nombre = updateTestpsicologicoDto.nombre;
    const existeTestConMismoNombre = await this.testpsicologicoRepository
      .createQueryBuilder('test')
      .where('test.nombre = :nombre', { nombre })
      .andWhere('test.id != :id', { id })
      .getOne();

    if (existeTestConMismoNombre) {
      throw new BadRequestException('Ya existe un test con ese nombre');
    }

    await this.testpsicologicoRepository.update(id, { ...updateTestpsicologicoDto, user });

    const testActualizado = await this.testpsicologicoRepository.findOneBy({ id });
    if (!testActualizado) {
      throw new NotFoundException('No se encontró el test después de actualizarlo');
    }

    return testActualizado;
  }

  async remove(id: string) {
    const existeTest = await this.testpsicologicoRepository.findOneBy({ id });
    if (!existeTest) {
      throw new NotFoundException('No se encontró el test');
    }
    if (existeTest.isActive) {
      await this.testpsicologicoRepository.update(id, { isActive: false });
      return { message: 'Test desactivado' };
    }
    else {
      await this.testpsicologicoRepository.update(id, { isActive: true });
      return { message: 'Test activado' };
    }
  }
}
