import "dotenv/config";
import "express-async-errors";
import express from "express";

import { notFound } from "./middleware/not-found.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";

import { connectDB } from "./db/connect.js";
import userRouter from "./routes/auth.js";
import jobsRouter from "./routes/jobs.js";

import authMiddleware from "../backend/middleware/authentication.js";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/jobs", authMiddleware, jobsRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

// Start the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
