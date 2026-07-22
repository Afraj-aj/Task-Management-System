-- Task Management System - Seed Data
-- Default user credentials:
--   Email: admin@test.com
--   Password: 123456 (pre-hashed with bcrypt)

-- User (password is pre-hashed bcrypt hash for "123456")
INSERT INTO users (name, email, password)
SELECT 'Admin', 'admin@test.com', '$2b$10$1DxK5Leb9CZ/phzW61v9u.SACW/45QkFn3z7YlWMj9eJ3RZNGk5Wa'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@test.com');

-- Sample tasks (linked to admin user)
INSERT INTO tasks (user_id, title, description, priority, status, due_date)
SELECT u.id, 'Complete project documentation', 'Write README and API docs', 'High', 'Pending', CURRENT_DATE + INTERVAL '3 days'
FROM users u WHERE u.email = 'admin@test.com'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Complete project documentation');

INSERT INTO tasks (user_id, title, description, priority, status, due_date)
SELECT u.id, 'Fix login bug', 'Users cannot login with special characters', 'High', 'In Progress', CURRENT_DATE + INTERVAL '1 day'
FROM users u WHERE u.email = 'admin@test.com'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Fix login bug');

INSERT INTO tasks (user_id, title, description, priority, status, due_date)
SELECT u.id, 'Design landing page', 'Create wireframes and mockups', 'Medium', 'Pending', CURRENT_DATE + INTERVAL '7 days'
FROM users u WHERE u.email = 'admin@test.com'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Design landing page');

INSERT INTO tasks (user_id, title, description, priority, status, due_date)
SELECT u.id, 'Write unit tests', 'Add tests for auth and task controllers', 'Low', 'Pending', CURRENT_DATE + INTERVAL '14 days'
FROM users u WHERE u.email = 'admin@test.com'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Write unit tests');

INSERT INTO tasks (user_id, title, description, priority, status, due_date)
SELECT u.id, 'Database optimization', 'Add indexes and optimize queries', 'Medium', 'Completed', CURRENT_DATE - INTERVAL '2 days'
FROM users u WHERE u.email = 'admin@test.com'
AND NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Database optimization');
