import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: true })
  logoFilename: string | null;

  @Column({ nullable: false, default: 1 })
  howManyTimesUsed: number;

  @Column({ nullable: false, default: 0 })
  rating: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
