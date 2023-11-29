import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
} from "typeorm";

@Entity({ name: 'verification_codes' })
export class VerificationCode {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text' })
    code: string;

    @CreateDateColumn()
    createdAt: Date;
    @Column({ type: 'int', default: 0 })
    emailSendCount: number;
    @BeforeInsert()
    setExpiration() {
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 5);
        this.expiration = expirationTime;
        this.emailSendCount = 1;

    }

    @Column({ type: 'timestamp' })
    expiration: Date;
}

