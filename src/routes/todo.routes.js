import { Router } from "express";
import {
  createTodo,
  getAll,
  getOne,
  removeTodo,
  toggle,
  updateTodo,
} from "../controllers/todo.controller.js";
import { createTodoRules, updateTodoRules } from "../middlewares/validate.js";
import { authVerify } from "../middlewares/auth.middleware.js";

const router = Router();

// Collection
router.get("/", authVerify, getAll);
router.post("/", authVerify, createTodoRules, createTodo);

// Single resource
router.get("/:id", authVerify, getOne);
router.patch("/:id", authVerify, updateTodoRules, updateTodo);
router.delete("/:id", removeTodo);

// Extra action
router.patch("/:id/toggle", authVerify, toggle);

export default router;
