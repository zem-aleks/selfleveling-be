import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@langchain/langgraph-sdk';

@Injectable()
export class LanggraphService {
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    const apiUrl = this.configService.get('LANGGRAPH_API_URL') as
      | string
      | undefined;

    if (!apiUrl) {
      throw new Error('LANGGRAPH_API_URL is not defined');
    }

    this.client = new Client({ apiUrl });
  }

  async getOrCreateThread(threadId: string, graphId: string) {
    try {
      const existingThread = await this.client.threads.get(threadId);
      if (existingThread) {
        return existingThread;
      }
    } catch (error) {
      // Nothing to do, we just create a new one
    }

    return this.createThread(threadId, graphId);
  }

  async createThread(threadId: string, graphId: string) {
    return this.client.threads.create({
      threadId,
      graphId,
    });
  }

  async runStream({
    threadId,
    graphId,
    input,
  }: {
    threadId: string;
    graphId: string;
    input: Record<string, unknown>;
  }) {
    return this.client.runs.stream(threadId, graphId, {
      streamMode: 'updates',
      input,
    });
  }
}
