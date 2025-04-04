import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AssignedSkill {
  @PrimaryColumn({ nullable: false })
  skillId: string;

  @PrimaryColumn({ nullable: false })
  goalId: string;

  @PrimaryColumn({ nullable: false })
  heroId: string;

  @Column({ nullable: false, default: 1 })
  level: number;

  @Column({ nullable: false, default: 0 })
  experience: number;

  @Column({ nullable: false, default: 0, type: 'smallint' })
  vote: 1 | 0 | -1;

  @Column({ nullable: false, default: 'draft', type: 'varchar' })
  status: 'draft' | 'active';

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
