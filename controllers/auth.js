import { userModel } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  // Check if all required fields are provided
  if (!name || !password || !email) {
    throw new BadRequestError("Please provide name, email, and password");
  }

  // Check if the email is already registered
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("Email is already registered");
  }

  // Create the new user
  const user = await userModel.create({
    ...req.body,
  });

  const token = user.createJwt();

  // Respond with the created user (exclude password from the response)
  res.status(StatusCodes.CREATED).json({
    token,
    user: { name: user.name },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("please provide mail and password");
  }

  const existingUser = await userModel.findOne({ email });

  if (!existingUser) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await existingUser.checkPassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = existingUser.createJwt();
  res.status(StatusCodes.OK).json({ user: { name: existingUser.name }, token });
};

export { registerUser, loginUser };
