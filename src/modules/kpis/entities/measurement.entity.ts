import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  kpiId: string;

  @Column({ nullable: false })
  goalId: string;

  @Column({ nullable: false, type: 'varchar' })
  value: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
