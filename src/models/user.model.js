import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const initUserTable = async () => {
  const sql_query = `
    CREATE TABLE IF NOT EXISTS users (
      id          VARCHAR(36) NOT NULL PRIMARY KEY,
      name        VARCHAR(50) NOT NULL,
      email       VARCHAR(50) NOT NULL UNIQUE,
      password    VARCHAR(255) NOT NULL,
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
      updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await pool.execute(sql_query);
};

export const getUser = async (email = null, id = null) => {
  if (email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] ?? null;
  } else if (id) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] ?? null;
  } else {
    return null;
  }
};

export const create = async ({ id, name, email, password }) => {
  const hashPassword = await bcrypt.hash(password, 10);

  await pool.execute(
    "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
    [id, name, email, hashPassword],
  );

  return await getUser(email);
};

export const verifyPassword = async (email, password) => {
  const user = await getUser(email);
  return await bcrypt.compare(password, user?.password);
}
