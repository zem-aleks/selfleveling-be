import { Message } from '../../messages/entities/message.entity';
import { AiChatMessage } from '../types/message';
import { notReachable } from '../../../shared/utils/notReachable';
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from '@langchain/core/messages';

export const mapDbMessageIntoAi = (message: Message): AiChatMessage => {
  switch (message.role) {
    case 'user':
      return new HumanMessage({
        content: message.content,
      });

    case 'assistant':
      return new AIMessage({
        content: message.content,
      });

    case 'system':
      return new SystemMessage({
        content: message.content,
      });

    default:
      return notReachable(message.role);
  }
};
