import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import { create, findAll, findById, remove, update } from "../models/todo.model.js";
import { error, success } from "../utils/response.js"
import { logger } from "../utils/logger.js";

// GET /todos
export const getAll = async (req, res, next) => {
  try {
    const { completed, priority, search, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const { rows, total } = await findAll({ created_by: req.user.id, completed, priority, search, limit: limitNum, offset });

    return success(res, {
      todos: rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /todos/:id
export const getOne = async (req, res, next) => {
  try {
    const todo = await findById({ id: req.params.id, created_by: req.user.id });
    if (!todo) return error(res, 'Todo not found', 404);
    return success(res, { todo });
  } catch (err) {
    next(err);
  }
};

// POST /todos
export const createTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, 'Validation failed', 422, errors.array());

    const { title, description, priority } = req.body;
    const todo = await create({ id: uuidv4(), created_by: req.user.id, title, description, priority });

    logger.info(`Todo created: ${todo.id}`);
    return success(res, { todo }, 'Todo created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// PATCH /todos/:id
export const updateTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return error(res, 'Validation failed', 422, errors.array());

    const existing = await findById(req.params.id);
    if (!existing) return error(res, 'Todo not found', 404);

    const todo = await update(req.params.id, req.user.id, req.body);
    logger.info(`Todo updated: ${todo.id}`);
    return success(res, { todo }, 'Todo updated successfully');
  } catch (err) {
    next(err);
  }
};

// DELETE /todos/:id
export const removeTodo = async (req, res, next) => {
  try {
    const deleted = await remove({ id: req.params.id, created_by: req.user.id });
    if (!deleted) return error(res, 'Todo not found', 404);
    logger.info(`Todo deleted: ${req.params.id}`);
    return success(res, null, 'Todo deleted successfully');
  } catch (err) {
    next(err);
  }
};

// PATCH /todos/:id/toggle
export const toggle = async (req, res, next) => {
  try {
    const existing = await findById({ id: req.params.id, created_by: req.user.id });
    if (!existing) return error(res, 'Todo not found', 404);

    const todo = await update(req.params.id, { completed: !existing.completed });
    return success(res, { todo }, `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`);
  } catch (err) {
    next(err);
  }
};
