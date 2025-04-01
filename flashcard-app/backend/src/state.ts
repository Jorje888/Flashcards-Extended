import { Flashcard, BucketMap, AnswerDifficulty } from "@logic/flashcards";
import { PracticeRecord } from "./types/index";

const initialCards: Flashcard[] = [
  new Flashcard("What is the capital of France?", "Paris", "Ui Ui Bagguette", [
    "Geography",
  ]),
  new Flashcard("What is the capital of Italy?", "Rome", "Determinazione!", [
    "Geography",
  ]),
  new Flashcard("What is the capital of Germany?", "Berlin", "Dude come on", [
    "Geography",
  ]),
  new Flashcard("What is the capital of Spain?", "Madrid", "Real-", [
    "Geography",
  ]),
  new Flashcard(
    "What is the capital of Portugal?",
    "Lisbon",
    "Sounds like Lesbian",
    ["Geography"]
  ),
  new Flashcard("What is the capital of Greece?", "Athens", "Not Sparta", [
    "Geography",
  ]),
];
let currentBuckets: BucketMap = new Map();
currentBuckets.set(0, new Set(initialCards));
let practiceHistory: PracticeRecord[] = [];
let currentDay: number = 0;

export function getBuckets(): BucketMap {
  return currentBuckets;
}

export function setBuckets(newBuckets: BucketMap): void {
  currentBuckets = newBuckets;
}

export function getHistory(): PracticeRecord[] {
  return practiceHistory;
}

export function addHistoryRecord(record: PracticeRecord): void {
  practiceHistory.push(record);
}

export function getCurrentDay(): number {
  return currentDay;
}

export function incrementDay(): void {
  currentDay++;
}

export function findCard(front: string, back: string): Flashcard | undefined {
  for (const bucket of currentBuckets.values()) {
    for (const card of bucket) {
      if (card.front === front && card.back === back) {
        return card;
      }
    }
  }
  return undefined;
}

export function findCardBucket(cardToFind: Flashcard): number | undefined {
  for (const [bucketNumber, bucket] of currentBuckets.entries()) {
    if (bucket.has(cardToFind)) {
      return bucketNumber;
    }
  }
  return undefined;
}

console.log("Initial state:", currentBuckets);

