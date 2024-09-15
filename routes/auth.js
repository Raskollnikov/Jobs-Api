import express from "express";
const userRouter = express.Router();

import { loginUser, registerUser } from "../controllers/auth.js";

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

export default userRouter;
