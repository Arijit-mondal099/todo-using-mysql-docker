import { Router } from "express";
import { createUser, loginUser } from "../middlewares/validate.js";
import { login, logout, register } from "../controllers/user.controller.js";
import { authVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", createUser, register);
router.post("/login", loginUser, login);
router.post("/logout", authVerify, logout);

export default router;
