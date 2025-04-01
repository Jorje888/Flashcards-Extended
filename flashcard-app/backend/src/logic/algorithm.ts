/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";
import { PracticeRecord, ProgressStats, SessionHistory } from "../types/index";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  const bucketArray = new Array<Set<Flashcard>>();
  const keys = Array.from(buckets.keys());
  const maxKey = Math.max(...keys);
  if(keys.length === 0) return bucketArray;

  for (let i = 0; i <= maxKey; i++) {
    if (buckets.has(i)) {
      bucketArray.push(buckets.get(i)!);
    } else {
      bucketArray.push(new Set<Flashcard>());
    }
  }
  return bucketArray;
}

export function isPrime(n: number) {
  if (n <= 1) return false;
  for (let i = 2; i < n; i++) if (n % i === 0) return false;

  return true;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  const nonEmptyBuckets = buckets.filter((bucket) => bucket.size > 0);
  if (nonEmptyBuckets.length === 0) return undefined;
  const minBucket = Math.min(...nonEmptyBuckets.map((bucket) => bucket.size));
  const maxBucket = Math.max(...nonEmptyBuckets.map((bucket) => bucket.size));
  return { minBucket, maxBucket };
}

/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  const practiceSet = new Set<Flashcard>();
  if (buckets.length === 0) return practiceSet;
  else for (const card of buckets[0]!) {
    practiceSet.add(card);
  }
  if (day <= 0 || day % 1 === 1) {
    return buckets[0]!;
  }
  for (let i = 1; i < buckets.length; i++) {
    if ((day % Math.pow(2, i))  === 0) {
      for (const card of buckets[i]!) {
        practiceSet.add(card);
      }
    }
    }
  return practiceSet;
}

/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  const newBuckets: BucketMap = new Map<number, Set<Flashcard>>();

  // Iterate over each bucket and duplicate its contents
  for (const [key, flashSet] of buckets.entries()) {
    const newFlashSet = new Set<Flashcard>(flashSet);
    newBuckets.set(key, newFlashSet);
  }

  const currentBucket = Array.from(buckets.keys()).find(key => buckets.get(key)!.has(card));
  if (currentBucket === undefined) {
    const firstBucket = buckets.get(0)!;
    firstBucket.add(card);
    newBuckets.set(0, firstBucket);
  } else {
    const newFlashSet = new Set<Flashcard>(buckets.get(currentBucket)!);
    if (difficulty === AnswerDifficulty.Easy) {
      newFlashSet.delete(card);
      const nextFlashSet = new Set<Flashcard>(buckets.get(currentBucket + 1)!);
      nextFlashSet.add(card);
      newBuckets.set(currentBucket, newFlashSet);
      newBuckets.set(currentBucket + 1, nextFlashSet);
    } else if (difficulty === AnswerDifficulty.Wrong) {
      newFlashSet.delete(card);
      newBuckets.set(currentBucket, newFlashSet);
      const firstFlashSet = new Set<Flashcard>(buckets.get(0)!);
      firstFlashSet.add(card);
      newBuckets.set(0, firstFlashSet);
    }
  }
  return newBuckets;
}

/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
export function getHint(card: Flashcard): string {
  if (card.hint !== "") {
    return card.hint;
  }
  return "You're on your own with this one";
}

/**
 * Computes statistics about the user's learning progress.
 *
 * @param sessionHistory representation of the last session activities
 * @param progressStats success rate records of previous sessions.
 * @returns statistics about current session and overall learning progress.
 * @spec.requires sessionHistory is a valid representation of user's answer history.
 * @spec.requires progressStats is a valid representation of learning progress.
 */
export function computeProgress(
  sessionHistory: SessionHistory,
  progressStats: ProgressStats,
): PracticeRecord {
  const totalCards = Array.from(sessionHistory.successMap.keys()).length || 1;
  var hintsNeeded: number = 0;
  const gotWrong: Flashcard[] = [];
  sessionHistory.successMap.forEach((result, flashcard) => {
    if (result.length === 2) {
      if (result[0] === AnswerDifficulty.Wrong) gotWrong.push(flashcard);
      if (result[1]) hintsNeeded ++;
    }
  });
  const successRate = (totalCards - gotWrong.length) / totalCards * 100;
  progressStats.successRates.push(successRate);
  return {
    totalCards,
    successRate,
    hintsNeeded,
    gotWrong,
    progressStats: { successRates: [...progressStats.successRates, successRate] },
  };
}