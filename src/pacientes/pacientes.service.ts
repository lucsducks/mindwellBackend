import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

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
      relations: ['psicologo', 'paciente'],
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
      relations: ['psicologo', 'paciente'],
    });
  }


  async findOne(id: string) {
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['psicologo', 'paciente'],
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
    this.pacienteRepository.merge(paciente, {
      psicologoId: updatePacienteDto.psicologo,
      pacienteId: updatePacienteDto.paciente
    });
    return this.pacienteRepository.save(paciente);

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
