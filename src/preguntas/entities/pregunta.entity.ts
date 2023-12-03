import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { TestPsicologico } from 'src/testpsicologicos/entities/testpsicologico.entity';
import { Respuesta } from 'src/respuestas/entities/respuesta.entity';
import { HistorialRespuesta } from 'src/historialrespuestas/entities/historialrespuesta.entity';

@Entity({ name: 'preguntas' })
export class Pregunta {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    pregunta: string;

    @Column('text')
    tipoRespuesta: string;
    @Column('text', { nullable: true })
    divisiondePregunta?: string;
    @Column({ type: 'bool', default: true })
    isActive: boolean;
    @Column('text', { array: true, default: [] })
    respuestasposibles: string[];
    @ManyToOne(() => TestPsicologico, testPsicologico => testPsicologico.preguntas)
    testPsicologico: TestPsicologico;

    @OneToMany(() => Respuesta, respuesta => respuesta.pregunta)
    respuestas: Respuesta[];
    @OneToMany(() => HistorialRespuesta, historialRespuesta => historialRespuesta.user)
    historialRespuestasPregunta: HistorialRespuesta[];
}
