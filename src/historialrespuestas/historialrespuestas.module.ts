import { Module } from '@nestjs/common';
import { HistorialrespuestasService } from './historialrespuestas.service';
import { HistorialrespuestasController } from './historialrespuestas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialRespuesta } from './entities/historialrespuesta.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PreguntasModule } from 'src/preguntas/preguntas.module';
import { TestpsicologicosModule } from 'src/testpsicologicos/testpsicologicos.module';

@Module({
  controllers: [HistorialrespuestasController],
  imports: [TypeOrmModule.forFeature([HistorialRespuesta]),AuthModule,PreguntasModule,TestpsicologicosModule],

  providers: [HistorialrespuestasService],
})
export class HistorialrespuestasModule {}
