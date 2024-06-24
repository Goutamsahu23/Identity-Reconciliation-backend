import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    phoneNumber!: string;

    @Column({ nullable: true })
    email!: string;

    @Column({ nullable: true })
    linkedId!: number;

    @Column()
    linkPrecedence!: 'primary' | 'secondary';

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    deletedAt!: Date;

    @Column("simple-array", { nullable: true }) // Store emails as an array of strings
    emails: string[];

    @Column("simple-array", { nullable: true }) // Store phone numbers as an array of strings
    phoneNumbers: string[];
}
