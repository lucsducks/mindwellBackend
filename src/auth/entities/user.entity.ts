import { HistorialRespuesta } from "src/historialrespuestas/entities/historialrespuesta.entity";
import { TestPsicologico } from "src/testpsicologicos/entities/testpsicologico.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    name: string;
    @Column('text')
    lastname: string;
    @Column('text',{nullable:true})
    levelEducation: string;
    @Column('text', { unique: true })
    email: string;
    @Column('text', { select: false })
    password: string;
    @Column({ type: 'bool', default: true })
    isActive: boolean;
    @Column({ type: 'bool', default: false })
    verify: boolean;
    @Column('text', { array: true, default: ['user'] })
    roles: string[];
    @CreateDateColumn()
    createdAt: Date;
    @OneToMany(() => TestPsicologico, testPsicologico => testPsicologico.user)
    testPsicologico: TestPsicologico[];
    @OneToMany(() => HistorialRespuesta, testPsicologico => testPsicologico.user)
    historialRespuestas: HistorialRespuesta[];
    @BeforeInsert()
    @BeforeUpdate()
    checkfielemail() {
        this.email = this.email.toLowerCase().trim();
    }

}
