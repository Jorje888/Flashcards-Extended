import express from "express";
import cors from "cors";
import * as logic from "@logic/algorithm";
import  * as state from "./state";
import { Flashcard, BucketMap, AnswerDifficulty } from "@logic/flashcards";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/practice", (req, res) => {
  try {
    const day = state.getCurrentDay();
    const bucketsMap = state.getBuckets();
    const bucketSets = logic.toBucketSets(bucketsMap);
    const cards = logic.practice(bucketSets, day);
    const cardsArray = Array.from(cards);
    console.log(`Found ${cardsArray.length} cards for day ${day}.`);
    res.json({ cardsArray, day });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/update", (req, res) => {
  try {
    const { cardFront, cardBack, hint, tags, difficulty } = req.body;
    if (!Object.values(AnswerDifficulty).includes(difficulty)) {
      return res.status(400).json({ message: "That is not an acceptable difficulty" });
    }
    var currentBuckets = state.getBuckets();
    const newCard : Flashcard = {front: cardFront, back: cardBack, hint: hint, tags: tags};
    const previousBucketNumber = state.findCardBucket(newCard);
    if (previousBucketNumber === undefined) {
      return res.status(404).json({ message: "Card not found" }); 
    }
    currentBuckets = logic.update(currentBuckets, newCard, difficulty);
    state.setBuckets(currentBuckets);
    const newBucketNumber = state.findCardBucket(newCard);
    if (newBucketNumber === undefined) {
      return res.status(500).json({ message: "Internal Server Error. Card Difficulty Update Failed" });
    }
    state.addHistoryRecord({
      cardFront: cardFront,
      cardBack: cardBack,
      timestamp: Date.now(),
      difficulty: difficulty,
      previousBucket: previousBucketNumber,
      newBucket: newBucketNumber,
    });
    console.log(`Updated card difficulty from ${previousBucketNumber} to ${newBucketNumber}.`);
    res.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


