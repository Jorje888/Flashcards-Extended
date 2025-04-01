import { Flashcard, AnswerDifficulty, BucketMap } from "../logic/flashcards";
export interface PracticeSession {
  cards: Flashcard[];
  day: number;
}

export interface UpdateRequest {
  cardFront: string;
  cardBack: string;
  difficulty: AnswerDifficulty;
}

export interface HintRequest {
  cardFront: string;
  cardBack: string;
}

export interface ProgressStats {
  successRates: number[];
}

export interface SessionHistory{
   successMap: Map<Flashcard, [AnswerDifficulty, boolean]>;
}

export interface Statistics {
  totalCards: number;
  successRate: number;
  hintsNeeded: number;
  gotWrong: Flashcard[];
  progressStats: ProgressStats;
}

export { Flashcard, AnswerDifficulty, BucketMap };
