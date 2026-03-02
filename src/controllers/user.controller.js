import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import { create, getUser, verifyPassword } from "../models/user.model.js";
import { error, success } from "../utils/response.js";
import { logger } from "../utils/logger.js";
import { generateTokenAndSetToken } from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, "Validation failed", 422, errors.array());
    }

    const { name, email, password } = req.body;
    const user = await create({ id: uuidv4(), name, email, password });

    logger.info(`User created: ${user.id}`);
    return success(res, { user }, "User created successfully", 201);
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, "Validation failed", 422, errors.array());
    }

    const { email, password } = req.body;

    const user = await getUser(email);
    if (!user) {
      return error(res, "Oops invalid creadintials", 400);
    }

    const isValidPassword = await verifyPassword(email, password);
    if (!isValidPassword) {
      return error(res, "Oops invalid creadintials", 400);
    }

    const token = await generateTokenAndSetToken(res, user.id);

    return success(
      res,
      { userId: user.id, token },
      "User login succcessfully",
      200,
    );
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return success(res, {}, "User logout successfully", 200);
  } catch (err) {
    return next(err);
  }
};
