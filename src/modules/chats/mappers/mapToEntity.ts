import { ChatEntity } from '../types/entity';
import { Chat } from '../entities/chat.entity';

export const mapToEntity = (chat: Chat): ChatEntity => {
  return chat;
};
