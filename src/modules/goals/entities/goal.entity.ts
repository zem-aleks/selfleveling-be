import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GoalEvaluation } from '../types/entity';

export type GoalStatus = 'draft' | 'formed' | 'review' | 'active';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  heroId: string;

  @Generated('uuid')
  @Column({ nullable: false })
  threadId: string;

  @Column({ nullable: false })
  goal: string;

  @Column({ nullable: false, type: 'simple-json' })
  evaluation: GoalEvaluation;

  @Column({ nullable: true, type: 'varchar' })
  title: string | null;

  @Column({ nullable: false, type: 'varchar' })
  status: GoalStatus;

  @Column({ nullable: false })
  targetDate: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
