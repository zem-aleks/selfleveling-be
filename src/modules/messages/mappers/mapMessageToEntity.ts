import { MessageEntity } from '../types/entity';
import { Message } from '../entities/message.entity';

export const mapMessageToEntity = (message: Message): MessageEntity => {
  return {
    ...message,
  };
};
