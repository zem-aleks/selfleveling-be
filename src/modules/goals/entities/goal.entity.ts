import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type GoalStatus = 'draft';

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

  @Column({ nullable: false, type: 'varchar' })
  status: GoalStatus;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
