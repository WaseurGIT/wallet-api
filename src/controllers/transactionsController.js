import { sql } from "../config/db.js";

// 2
export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    // console.log(userId);

    const transactions = await sql`
        SELECT * FROM transaction WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting the transaction: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// 1
export async function createTransaction(req, res) {
  // title, amount, category, user_id
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // inserting the value in the table
    const transaction = await sql`
        INSERT INTO transaction(user_id, title, amount, category)
        VALUES(${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
    `;
    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error posting the transaction: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// 3
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      res.status(400).json({ message: "Invalid transaction id" });
    }

    const result = await sql`
        DELETE FROM transaction WHERE id = ${id} RETURNING *   
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting the transaction: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// 4
export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    // balance
    const balanceResult = await sql`
        SELECT COALESCE(SUM(amount),0) as balance FROM transaction WHERE user_id = ${userId}
    `;

    // income
    const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transaction 
        WHERE user_id = ${userId} AND amount > 0
    `;
    // expense
    const expensesResult = await sql`
        SELECT COALESCE(SUM(amount),0) as expenses FROM transaction 
        WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error getting the summary: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
