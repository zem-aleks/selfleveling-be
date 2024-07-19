import { ChatEntityWithThreads } from '../types/entity';
import { ThreadEntityWithMessages } from '../../threads/types/entity';
import { Thread } from '../../threads/entities/thread.entity';
import { Chat } from '../entities/chat.entity';
import { Message } from '../../messages/entities/message.entity';
import { mapChatToEntity } from './mapChatToEntity';

export const mapToChatEntityWithThreads = (
  chat: Chat,
  threads: Thread[],
  messages: Message[],
): ChatEntityWithThreads => {
  const chatEntity = mapChatToEntity(chat);
  const messagesByThread = messages.reduce<Record<string, Message[]>>(
    (acc, message) => {
      if (!acc[message.threadId]) {
        acc[message.threadId] = [];
      }
      acc[message.threadId].push(message);
      return acc;
    },
    {},
  );

  const threadEntities: ThreadEntityWithMessages[] = threads.map((thread) => {
    return {
      ...thread,
      messages: messagesByThread[thread.id] || [],
    };
  });

  return {
    ...chatEntity,
    threads: threadEntities,
  };
};
