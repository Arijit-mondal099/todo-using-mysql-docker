import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

export const generateTokenAndSetToken = async (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
  } catch (error) {
    logger.error(`Error from generate token: ${error?.message}`);
  }
};
