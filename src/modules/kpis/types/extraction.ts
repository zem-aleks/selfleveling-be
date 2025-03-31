import { ChatMessage } from '@langchain/core/messages';

export type ExtractGoalResult =
  | {
      type: 'followUp';
      score: number;
      followUpQuestion: string;
    }
  | {
      type: 'success';
      score: number;
      title: string;
      description: string;
    };

export type ExtractGoalScoreEvent = { extractGoalScore: { score: number } };
export type ExtractUserGoalEvent = {
  extractUserGoal: { goal: { goalTitle: string; goalDescription: string } };
};
export type ExtractFolloUpQuestionEvent = {
  prepareFollowUpQuestion: { messages: ChatMessage[] };
};

export type GoalExtractionEvent =
  | ExtractGoalScoreEvent
  | ExtractFolloUpQuestionEvent
  | ExtractUserGoalEvent;
