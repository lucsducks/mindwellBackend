import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { PacientesModule } from './pacientes/pacientes.module';
import { TestpsicologicosModule } from './testpsicologicos/testpsicologicos.module';
import { PreguntasModule } from './preguntas/preguntas.module';
import { RespuestasModule } from './respuestas/respuestas.module';
import { HistorialrespuestasModule } from './historialrespuestas/historialrespuestas.module';

@Module({
  imports: [ConfigModule.forRoot(), ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }), TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: true,
  }), CommonModule, AuthModule, FilesModule,ScheduleModule.forRoot(), PacientesModule, TestpsicologicosModule, PreguntasModule, RespuestasModule, HistorialrespuestasModule,],
})
export class AppModule { }
