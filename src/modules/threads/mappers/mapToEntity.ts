import { ThreadEntity, ThreadEntityWithMessages } from '../types/entity';
import { Thread } from '../entities/thread.entity';
import { MessageEntity } from '../../messages/types/entity';

export const mapToEntity = (thread: Thread): ThreadEntity => {
  return {
    ...thread,
  };
};

export const mapToThreadWithMessages = (
  thread: Thread,
  messages: MessageEntity[],
): ThreadEntityWithMessages => {
  const threadEntity = mapToEntity(thread);
  return {
    ...threadEntity,
    messages,
  };
};
