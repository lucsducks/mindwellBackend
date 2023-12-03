import { Module } from '@nestjs/common';
import { TestpsicologicosService } from './testpsicologicos.service';
import { TestpsicologicosController } from './testpsicologicos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestPsicologico } from './entities/testpsicologico.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TestpsicologicosController],
  imports: [TypeOrmModule.forFeature([TestPsicologico]),AuthModule],

  providers: [TestpsicologicosService],
  exports: [TypeOrmModule]
})
export class TestpsicologicosModule {}
