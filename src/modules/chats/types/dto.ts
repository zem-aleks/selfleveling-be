import { ChatEntityWithThreads } from './entity';
import { ThreadConfig } from '../../threads/types/entity';

export type CreateChatRequestDto = {
  threadConfigs: ThreadConfig[];
  message: string;
};

export type CreateChatResponseDto = ChatEntityWithThreads;
