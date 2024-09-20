import "dotenv/config";
import "express-async-errors";
import express from "express";

import { notFound } from "./middleware/not-found.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";

import { connectDB } from "./db/connect.js";
import userRouter from "./routes/auth.js";
import jobsRouter from "./routes/jobs.js";

import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";

//swagger
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./swagger.yaml");

import authMiddleware from "./middleware/authentication.js";

const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"], 
    credentials: true,
  })
);
app.use(helmet());
app.use(xss());

app.get("/", (req, res) => {
  res.send("<h1>Jobs Api</h1> <a href='/api-docs'>Documentation</a>");
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
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
