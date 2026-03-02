import { body } from "express-validator";

export const createUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50, min: 4 })
    .withMessage("Name must be at most 4 characters and max 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50, min: 4 })
    .withMessage("Email must be at most 4 characters and max 50 characters")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 16, min: 8 })
    .withMessage("Password must be at most 4 characters and max 50 characters"),
];

export const loginUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50, min: 4 })
    .withMessage("Email must be at most 4 characters and max 50 characters")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 16, min: 8 })
    .withMessage("Password must be at most 4 characters and max 50 characters"),
];

export const createTodoRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description must be at most 2000 characters"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
];

export const updateTodoRules = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description must be at most 2000 characters"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
];
