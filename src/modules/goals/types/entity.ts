import { ChatMessage } from '@langchain/core/messages';

type GoalCommonFields = {
  id: string;
  userId: string;
  heroId: string;
  threadId: string;
};

export type GoalDraft = GoalCommonFields & {
  goal: string;
  status: 'draft';
};

export type GoalEntity = GoalDraft;

export type ExtractGoalResult = {
  type: 'followUp';
  score: number;
  followUpQuestion: string;
};

export type GoalExtractionEvent =
  | { extractGoalScore: { score: number } }
  | { prepareFollowUpQuestion: { messages: ChatMessage[] } };

// type GoalProcessing = {};

// short goal name
// goal description

// kpis: title, starting point and ending point

type Goal = {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  kpis: GoalKpi[]; // quantitative representation of the goal
  measurements: Measurement[]; // real measurements of progress, entered by a user
  createdAt: Date;
  updatedAt: Date;
  experience: number; // experience points gained by completing the goal quests
  levels: GoalLevel[]; // goals that are accomplished by completing this goal
  skills: Skill[];
  // levels: GoalLevel[];
};

type Skill = {
  id: string;
  name: string;
  logoUrl: string;
  description: string; // describes a nature of this attribute
  goalId: string;
  level: number;
  experience: number;
  experienceToTheNextLevel: number;
};

type Measurement = {
  id: string;
  kpiId: string;
  goalId: string;
  currentPoint: string;
  currentLevel: number; // on what level this measurement was done
  createdAt: Date;
  updatedAt: Date;
  comments: string;
};

type GoalKpi = {
  id: string;
  title: string;
  startingPoint: string;
  endingPoint: string;
  createdAt: Date;
  updatedAt: Date;
  goalId: string;
};

type GoalLevel = {
  id: string;
  level: number;
  status: 'active' | 'accomplished';
  goalId: string;
  // the value is aggregated with previous levels points
  experienceNeeded: number; // how many experience points are needed to level up, use logarithmic growth to calculate next level (base XP & log(level) + 1)
  accomplishmentSummary: string; // when the level is accomplished, the summary of the level by finished quests and user comments will be generated into this field
};

type Quest = {
  type: 'timebased';
  title: string;
  description: string;
  goalId: string;
  experience: number;
  skillsExperience: Array<{ skillId: string; experience: number }>;
  deadlineInSeconds: number; // how many seconds a user has to accomplish the quest after it's acceptance
};
