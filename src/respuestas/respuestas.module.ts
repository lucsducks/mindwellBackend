import { Module } from '@nestjs/common';
import { RespuestasService } from './respuestas.service';
import { RespuestasController } from './respuestas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respuesta } from './entities/respuesta.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RespuestasController],
  imports: [TypeOrmModule.forFeature([Respuesta]),AuthModule],

  providers: [RespuestasService],
})
export class RespuestasModule {}
