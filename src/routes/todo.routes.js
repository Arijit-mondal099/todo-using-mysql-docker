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

const router = Router();

// Collection
router.get("/", getAll);
router.post("/", createTodoRules, createTodo);

// Single resource
router.get("/:id", getOne);
router.patch("/:id", updateTodoRules, updateTodo);
router.delete("/:id", removeTodo);

// Extra action
router.patch("/:id/toggle", toggle);

export default router;
