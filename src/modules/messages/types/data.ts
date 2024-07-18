import { Message } from '../entities/message.entity';

export type MessageCreateData = Omit<Message, 'id' | 'createdAt' | 'updatedAt'>;
