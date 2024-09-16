import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors/unauthenticated.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided or incorrect format");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    const { name, userId } = decodeToken;
    req.user = { name, userId };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Auth is Invalid");
  }
};
export default authMiddleware;
