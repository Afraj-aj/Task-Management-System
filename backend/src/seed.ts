import bcrypt from "bcrypt";
import pool from "./config/database";

async function seed() {
  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      ["admin@test.com"]
    );

    if (existingUser.rows.length > 0) {
      console.log("Default user already exists, skipping seed.");
      return;
    }

    const plainPassword = "123456";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const userResult = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      ["Admin", "admin@test.com", hashedPassword]
    );

    const userId = userResult.rows[0].id;

    await pool.query(
      `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
       VALUES
         ($1, 'Complete project documentation', 'Write README and API docs', 'High', 'Pending', CURRENT_DATE + INTERVAL '3 days'),
         ($1, 'Fix login bug', 'Users cannot login with special characters', 'High', 'In Progress', CURRENT_DATE + INTERVAL '1 day'),
         ($1, 'Design landing page', 'Create wireframes and mockups', 'Medium', 'Pending', CURRENT_DATE + INTERVAL '7 days'),
         ($1, 'Write unit tests', 'Add tests for auth and task controllers', 'Low', 'Pending', CURRENT_DATE + INTERVAL '14 days'),
         ($1, 'Database optimization', 'Add indexes and optimize queries', 'Medium', 'Completed', CURRENT_DATE - INTERVAL '2 days')`,
      [userId]
    );

    console.log("Seed completed: default user and sample tasks created.");
  } catch (error) {
    console.error("Seed failed:", error);
  }
}

export default seed;
