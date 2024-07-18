import { ThreadEntityWithMessages } from '../../threads/types/entity';

export type ChatEntity = {
  id: string;
  userId: string;
  title: string;
  subtitle: string | null;
  logo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatEntityWithThreads = ChatEntity & {
  threads: ThreadEntityWithMessages[];
};
