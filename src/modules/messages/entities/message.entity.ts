import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageRole } from '../types/roles';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'text' })
  content: string;

  @Column({ nullable: false, type: 'varchar' })
  role: MessageRole;

  @Column({ nullable: false })
  tokens: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: false })
  chatId: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  threadId: string;
}
