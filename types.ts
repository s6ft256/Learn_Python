
export type Tier = 'Beginner' | 'Intermediate' | 'Advanced';
export type Specialization = 'None' | 'Data Wizard' | 'Web Architect';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  tier: Tier;
  path: Specialization;
  points: number;
  initialCode: string;
  solutionTemplate: string;
  hints: string[];
  concepts: string[];
  expectedOutput?: string;
}

export interface UserStats {
  xp: number;
  level: number;
  rank: string;
  streak: number;
  completedIds: string[];
  chosenPath: Specialization;
  skills: {
    syntax: number;
    logic: number;
    oop: number;
    async: number;
    architecture: number;
    data: number;
  };
}

export interface Feedback {
  status: 'correct' | 'incorrect' | 'syntax-error';
  message: string;
  aiExplanation?: string;
  suggestion?: string;
}
