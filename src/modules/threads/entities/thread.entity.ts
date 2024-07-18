import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Thread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  modelType: string;

  @Column({ nullable: false, type: 'float' })
  temperature: number;

  @Column({ nullable: false })
  systemPrompt: string;

  @Column({ nullable: false })
  systemPromptTokens: number;

  @Column({ nullable: false, default: 0 })
  tokensUsed: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: false })
  chatId: string;

  @Column({ nullable: false })
  userId: string;
}
