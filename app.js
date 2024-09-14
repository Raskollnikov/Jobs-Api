import "dotenv/config";
import "express-async-errors";
import express from "express";

import { notFound } from "./middleware/not-found.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";

import { connectDb } from "./db/connect.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("jobs api");
});

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

// Start the server
const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
