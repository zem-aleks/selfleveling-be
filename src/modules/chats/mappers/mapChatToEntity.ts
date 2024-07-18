import { ChatEntity } from '../types/entity';
import { Chat } from '../entities/chat.entity';

export const mapChatToEntity = (chat: Chat): ChatEntity => {
  return chat;
};
