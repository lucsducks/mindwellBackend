import { User } from 'src/auth/entities/user.entity';
import { TestPsicologico } from 'src/testpsicologicos/entities/testpsicologico.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity({ name: 'pacientes' })
export class Paciente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { cascade: true })
    @JoinColumn({ name: 'psicologoId' })
    psicologo: User;

    @Column({ type: 'uuid' })
    psicologoId: string;
    @ManyToMany(() => TestPsicologico)
    @JoinTable()
    testDisponibles: TestPsicologico[];

    @ManyToMany(() => TestPsicologico)
    @JoinTable()
    testTotales: TestPsicologico[];
    @ManyToOne(() => User, { cascade: true })
    @JoinColumn({ name: 'pacienteId' })
    paciente: User;

    @Column({ type: 'uuid' })
    pacienteId: string;
    @Column({ type: 'boolean', default: true })
    isActive: boolean;
    @CreateDateColumn()
    createdAt: Date;
}
