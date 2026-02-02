
export type Tier = 'Beginner' | 'Intermediate' | 'Advanced';
export type Specialization = 'None' | 'Data Wizard' | 'Web Architect';

export interface Pitfall {
  pattern: string | RegExp;
  guidance: string;
  action: string;
}

export interface LocalFeedback {
  success: {
    msg: string;
    explanation: string;
  };
  hint: string;
  pitfalls?: Pitfall[];
}

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
  localFeedback: LocalFeedback;
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
  status: 'correct' | 'incorrect' | 'syntax-error' | 'warning';
  message: string;
  aiExplanation?: string;
  suggestion?: string;
  actionableStep?: string;
}
