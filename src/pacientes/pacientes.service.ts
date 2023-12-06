import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { TestDto } from 'src/pacientes/dto/test.dto';
import { TestPsicologico } from 'src/testpsicologicos/entities/testpsicologico.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TestPsicologico)
    private readonly testPsicologicoRepository: Repository<TestPsicologico>

  ) { }
  async create(createPacienteDto: CreatePacienteDto) {
    const pacienteExistente = await this.pacienteRepository.findOne({
      where: {
        paciente: { id: createPacienteDto.paciente },
        psicologo: { id: createPacienteDto.psicologo }
      }
    });
    if (pacienteExistente) throw new ConflictException('Paciente ya existe');
    const psicologo = await this.userRepository.findOneBy({ id: createPacienteDto.psicologo });
    if (!psicologo.roles.includes('psicologo')) throw new NotFoundException('No es un psicologo del centro de salud');
    const nuevoPaciente = this.pacienteRepository.create({
      psicologoId: createPacienteDto.psicologo,
      pacienteId: createPacienteDto.paciente
    });

    await this.pacienteRepository.save(nuevoPaciente);

    const pacienteConRelaciones = await this.pacienteRepository.findOne({
      where: { id: nuevoPaciente.id },
      relations: ['psicologo', 'paciente']
    });

    if (!pacienteConRelaciones) {
      throw new Error('Error al cargar las relaciones del paciente');
    }

    return pacienteConRelaciones;

  }

  async findAll() {
    return this.pacienteRepository.find({
      relations: ['psicologo', 'paciente', 'testDisponibles', 'testTotales'],
    });
  }

  async findOnePacientes(psicologoId: string) {
    const psicologo = await this.userRepository.findOneBy({ id: psicologoId });
    if (!psicologo) {
      throw new NotFoundException(`Psicólogo con ID ${psicologoId} no encontrado`);
    }
    const esAdmin = psicologo.roles.includes('admin');
    if (esAdmin) {
      return this.findAll();
    }
    return this.pacienteRepository.find({
      where: { psicologoId: psicologoId },
      relations: ['psicologo', 'paciente', 'testDisponibles', 'testTotales'],
    });
  }


  async findOne(id: string) {
    const paciente = await this.pacienteRepository.find({
      where: { pacienteId: id },
      relations: ['psicologo', 'paciente', 'testDisponibles', 'testTotales'],
    });

    if (!paciente) throw new NotFoundException('Paciente no existe');

    return paciente;
  }


  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.pacienteRepository.findOneBy({ id });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    const psicologo = await this.userRepository.findOneBy({ id: updatePacienteDto.psicologo });
    if (!psicologo.roles.includes('psicologo')) throw new NotFoundException('No es un psicologo del centro de salud');
    const existePacienteConMismosDatos = await this.pacienteRepository.findOne({
      where: {
        psicologo: { id: updatePacienteDto.psicologo },
        paciente: { id: updatePacienteDto.paciente },
        id: Not(Equal(id))
      }
    });

    if (existePacienteConMismosDatos) {
      throw new ConflictException('Ya existe un paciente con los datos proporcionados');
    }
    this.pacienteRepository.merge(paciente, {
      psicologoId: updatePacienteDto.psicologo,
      pacienteId: updatePacienteDto.paciente
    });
    return this.pacienteRepository.save(paciente);

  }
  async updatePacienteTests(id: string, testDto: TestDto) {
    const paciente = await this.pacienteRepository.findOne({
      where: { id: id },
      relations: ['testDisponibles', 'testTotales'],
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    for (const idTest of testDto.tests) {
      if (!isUUID(idTest)) {
        throw new NotFoundException(`No es un test Psicologico correcto: ${idTest}`);
      }
    }
    let testVerifados: TestPsicologico[] = [];
    for (const idTest of testDto.tests) {
      const testExistente = await this.testPsicologicoRepository.findOneBy({ id: idTest });
      if (!testExistente) {
        throw new NotFoundException(`Test Psicologico con ID ${idTest} no encontrado`);
      } else {
        testVerifados.push(testExistente);
      }
    }
    let testTotales = paciente.testTotales;
    const idsTestTotales = new Set(paciente.testTotales.map(test => test.id));

    const nuevosTests = testVerifados.filter(test => !idsTestTotales.has(test.id));
    testTotales = [...paciente.testTotales, ...nuevosTests];

    paciente.testDisponibles = testVerifados;
    paciente.testTotales = testTotales;

    await this.pacienteRepository.save(paciente);

    return paciente;
  }
  async eliminarTestDisponible(idPaciente: string, idTest: string) {
    const paciente = await this.pacienteRepository.findOne({
      where: { pacienteId: idPaciente },
      relations: ['testDisponibles'], 
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${idPaciente} no encontrado`);
    }

    paciente.testDisponibles = paciente.testDisponibles.filter(test => test.id !== idTest);

    await this.pacienteRepository.save(paciente);

    return { message: 'Test Finalizado' }
  }



  async remove(id: string) {
    const paciente = await this.pacienteRepository.findOneBy({ id });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    if (paciente.isActive === false) {
      paciente.isActive = true;
      await this.pacienteRepository.save(paciente);
      return { message: 'Paciente activado' }
    }
    else {
      paciente.isActive = false;
      await this.pacienteRepository.save(paciente);
      return { message: 'Paciente desactivado' }
    }
  }
}
