import { User } from 'src/auth/entities/user.entity';
import { HistorialRespuesta } from 'src/historialrespuestas/entities/historialrespuesta.entity';
import { Pregunta } from 'src/preguntas/entities/pregunta.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'testpsicologicos' })
export class TestPsicologico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column()
  tipoTest: string;
  @Column('text', { nullable: true })
  reglasInterpretacion?: string;

  @Column({ nullable: true })
  duracionEstimada: number; // En minutos

  @Column({ type: 'bool', default: true })
  isActive: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.testPsicologico, { eager: true })
  user: User;
  @OneToMany(() => Pregunta, (pregunta) => pregunta.testPsicologico)
  preguntas: Pregunta[];
}
