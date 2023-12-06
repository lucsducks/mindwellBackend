import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { Paciente } from './entities/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TestpsicologicosModule } from 'src/testpsicologicos/testpsicologicos.module';

@Module({
  controllers: [PacientesController],
  imports: [TypeOrmModule.forFeature([Paciente]),AuthModule,TestpsicologicosModule],
  providers: [PacientesService],
})
export class PacientesModule {}
