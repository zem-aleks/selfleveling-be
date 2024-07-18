import { MessageRole } from './roles';

export type MessageEntity = {
  id: number;
  content: string;
  role: MessageRole;
  tokens: number;
  createdAt: Date;
  updatedAt: Date;
  chatId: string;
  userId: string;
  threadId: string;
};
