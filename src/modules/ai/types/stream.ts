import { MessageEntity } from '../../messages/types/entity';

export type ChatChunkStreamResponse = { type: 'chunk'; content: string };

export type ChatFinalStreamResponse = { type: 'final'; message: MessageEntity };
