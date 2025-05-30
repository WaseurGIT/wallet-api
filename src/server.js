import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionRoute from "./routes/transactionsRoute.js"

dotenv.config();
const app = express();

// built in middleware
app.use(rateLimiter)
app.use(express.json());

// custom middleware
// app.use((req, res, next) => {
//   console.log("we hit a req, the method", req.method);
//   next();
// });

const PORT = process.env.PORT || 5001;

// get -> fetch data from server
app.get("/", (req, res) => {
  res.send("its working");
});

app.use('/api/transactions', transactionRoute)
app.use('/api/products', transactionRoute)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Sever is up and running on PORT : ${PORT}`);
  });
});
