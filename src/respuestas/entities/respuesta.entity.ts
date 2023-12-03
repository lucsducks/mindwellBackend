import { Pregunta } from 'src/preguntas/entities/pregunta.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'respuestas' })
export class Respuesta {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    respuesta: string;

    @ManyToOne(() => Pregunta, pregunta => pregunta.respuestas)
    pregunta: Pregunta;
}
