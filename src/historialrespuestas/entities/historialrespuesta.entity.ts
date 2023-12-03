import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Pregunta } from 'src/preguntas/entities/pregunta.entity';
import { TestPsicologico } from 'src/testpsicologicos/entities/testpsicologico.entity';

@Entity({ name: 'historial_respuestas' })
export class HistorialRespuesta {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    respuesta: string;
    @Column('text')
    sessionId: string;
    @ManyToOne(() => Pregunta, pregunta => pregunta.historialRespuestasPregunta, { eager: true })
    pregunta: Pregunta;

    @CreateDateColumn()
    createdAt: Date;
    @ManyToOne(() => User, user => user.historialRespuestas, { eager: true })
    user: User;

}
