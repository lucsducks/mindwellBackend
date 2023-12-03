import { Module } from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { PreguntasController } from './preguntas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Pregunta } from './entities/pregunta.entity';
import { TestpsicologicosModule } from 'src/testpsicologicos/testpsicologicos.module';

@Module({
  controllers: [PreguntasController],
  imports: [TypeOrmModule.forFeature([Pregunta]),AuthModule,TestpsicologicosModule],
  exports: [TypeOrmModule],
  providers: [PreguntasService],
})
export class PreguntasModule {}
