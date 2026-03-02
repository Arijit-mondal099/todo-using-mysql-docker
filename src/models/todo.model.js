import { pool } from "../config/db.js";

// Run once at startup to create table if not exists
export const initTodoTable = async () => {
  const sql_query = `
    CREATE TABLE IF NOT EXISTS todos (
      id          VARCHAR(36) NOT NULL PRIMARY KEY,
      created_by  VARCHAR(36) NOT NULL,
      title       VARCHAR(255) NOT NULL,
      description TEXT,
      completed   TINYINT(1) NOT NULL DEFAULT 0,
      priority    ENUM('low','medium','high') NOT NULL DEFAULT 'low',
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await pool.execute(sql_query);
};

// Queries
export const findAll = async ({ created_by, completed, priority, search, limit, offset }) => {
  const conditions = ["created_by = ?"];
  const params = [created_by];

  if (completed !== undefined) {
    conditions.push("completed = ?");
    params.push(completed === "true" ? 1 : 0);
  }
  if (priority) {
    conditions.push("priority = ?");
    params.push(priority);
  }
  if (search) {
    conditions.push("(title LIKE ? OR description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countRow] = await pool.execute(
    `SELECT COUNT(*) AS total FROM todos ${where}`,
    params,
  );
  const total = countRow[0].total;

  const [rows] = await pool.execute(
    `SELECT * FROM todos ${where} ORDER BY created_at DESC LIMIT ${parseInt(limit, 10)} OFFSET ${parseInt(offset, 10)}`,
    params,
  );

  return { rows, total };
};

export const findById = async ({ id, created_by }) => {
  const [rows] = await pool.execute(
    "SELECT * FROM todos WHERE id = ? AND created_by = ?",
    [id, created_by],
  );
  return rows[0] || null;
};

export const create = async ({ id, created_by, title, description, priority }) => {
  await pool.execute(
    "INSERT INTO todos (id, created_by, title, description, priority) VALUES (?, ?, ?, ?, ?)",
    [id, created_by, title, description || null, priority || "medium"],
  );
  return findById({ id, created_by });
};

export const update = async (id, created_by, { title, description, completed, priority }) => {
  const fields = [];
  const params = [];

  if (title !== undefined) {
    fields.push("title = ?");
    params.push(title);
  }
  if (description !== undefined) {
    fields.push("description = ?");
    params.push(description);
  }
  if (completed !== undefined) {
    fields.push("completed = ?");
    params.push(completed ? 1 : 0);
  }
  if (priority !== undefined) {
    fields.push("priority = ?");
    params.push(priority);
  }

  if (!fields.length) return findById({ id, created_by });

  params.push(id);
  params.push(created_by);

  await pool.execute(
    `UPDATE todos SET ${fields.join(", ")} WHERE id = ? AND created_by = ?`,
    params,
  );
  
  return findById({ id, created_by });
};

export const remove = async ({ id, created_by }) => {
  const [result] = await pool.execute(
    "DELETE FROM todos WHERE id = ? AND created_by = ?",
    [id, created_by],
  );
  return result.affectedRows > 0;
};
