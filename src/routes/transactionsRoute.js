import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

// 2. get -> get the data from the database
router.get("/:userId", getTransactionsByUserId);

// 1. post -> create a new data and store in db
router.post("/", createTransaction);

// 3. delete ->
router.delete("/:id", deleteTransaction);

// 4. get -> get the summary
router.get("/summary/:userId", getSummaryByUserId);

export default router;
