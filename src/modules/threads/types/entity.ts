import { ModelType } from '../../ai/services/openai.service';
import { MessageEntity } from '../../messages/types/entity';

export type ThreadConfig = {
  modelType: ModelType;
  temperature: number;
  systemPrompt: string;
};

export type ThreadEntity = {
  id: string;
  modelType: string;
  temperature: number;
  systemPrompt: string;
  systemPromptTokens: number;
  tokensUsed: number;
  createdAt: Date;
  updatedAt: Date;
  chatId: string;
  userId: string;
};

export type ThreadEntityWithMessages = ThreadEntity & {
  messages: MessageEntity[];
};
