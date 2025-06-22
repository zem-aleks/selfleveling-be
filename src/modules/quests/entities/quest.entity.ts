import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestPenalties, QuestRewards } from '../types/entity';

@Entity()
export class Quest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  heroId: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false, type: 'simple-json' })
  rewards: QuestRewards;

  @Column({ nullable: false, type: 'simple-json' })
  penalties: QuestPenalties;

  @Column({ nullable: false })
  required: boolean;

  @Column({ nullable: false, default: false })
  isInitial: boolean;

  @Column({ nullable: false, type: 'varchar' })
  status: 'active' | 'completed' | 'failed';

  @Column({ nullable: false })
  deadline: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
