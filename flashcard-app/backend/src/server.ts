import express from "express";
import cors from "cors";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "@logic/algorithm";
import {
  getBuckets,
  setBuckets,
  getHistory,
  addHistoryRecord,
  getCurrentDay,
  incrementDay,
  findCard,
  findCardBucket,
} from "./state";
import { Flashcard, BucketMap, AnswerDifficulty } from "@logic/flashcards";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
