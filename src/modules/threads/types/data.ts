import { Thread } from '../entities/thread.entity';

export type ThreadCreateData = Omit<Thread, 'id' | 'createdAt' | 'updatedAt'>;
