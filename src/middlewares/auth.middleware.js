import jwt from "jsonwebtoken";
import { error } from "../utils/response.js";
import { getUser } from "../models/user.model.js";

export const authVerify = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return error(res, "Unauthorized request", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return error(res, "Unauthorized request", 401);
    }

    const user = await getUser(null, decoded.userId);
    if (!user) {
      return error(res, "Unauthorized request", 401);
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};
