import axios from "axios";
import {
  Flashcard,
  AnswerDifficulty,
  PracticeSession,
  UpdateRequest,
  PorgressStats,
} from "../types";

const API_BASE_URL = "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export function fetchPracticeCards(): Promise<PracticeSession> {
  return apiClient.get("/practice").then((response) => response.data);
}

export function submitAnswer(
  cardFront: string,
  cardBack: string,
  difficulty: AnswerDifficulty
): Promise<void> {
  return apiClient.post("/update", { cardFront, cardBack, difficulty });
}

export function fetchHint(card: Flashcard): Promise<string> {
  return apiClient
    .get("/hint", { params: { cardFront: card.front, cardBack: card.back } })
    .then((response) => response.data.hint);
}

export function fetchProgress(): Promise<PorgressStats> {
  return apiClient.get("/progress").then((response) => response.data);
}

export function advanceDay() {
  return apiClient.post("/day/next").then((response) => response.data);
}

//TODO data handling
