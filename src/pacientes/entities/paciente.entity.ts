import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'pacientes' })
export class Paciente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { cascade: true })
    @JoinColumn({ name: 'psicologoId' })
    psicologo: User;

    @Column({ type: 'uuid' })
    psicologoId: string;

    @ManyToOne(() => User, { cascade: true })
    @JoinColumn({ name: 'pacienteId'})
    paciente: User;

    @Column({ type: 'uuid' })
    pacienteId: string;
    @Column({ type: 'boolean', default: true })
    isActive:   boolean;
    @CreateDateColumn()
    createdAt: Date;
}
