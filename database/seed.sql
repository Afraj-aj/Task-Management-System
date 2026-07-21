-- Default user: admin@test.com / password: 123456
-- Password hash generated with bcrypt (10 rounds)

INSERT INTO users (name, email, password)
VALUES (
  'Admin',
  'admin@test.com',
  '$2b$10$8K1p/a0dL1LXMc.0SZ0w3OQH2xKGPKwHFt4EAURT7ORvlvdoUByVq'
)
ON CONFLICT (email) DO NOTHING;

-- Sample tasks
INSERT INTO tasks (user_id, title, description, priority, status, due_date)
VALUES
  (1, 'Complete project documentation', 'Write README and API docs', 'High', 'Pending', CURRENT_DATE + INTERVAL '3 days'),
  (1, 'Fix login bug', 'Users cannot login with special characters', 'High', 'In Progress', CURRENT_DATE + INTERVAL '1 day'),
  (1, 'Design landing page', 'Create wireframes and mockups', 'Medium', 'Pending', CURRENT_DATE + INTERVAL '7 days'),
  (1, 'Write unit tests', 'Add tests for auth and task controllers', 'Low', 'Pending', CURRENT_DATE + INTERVAL '14 days'),
  (1, 'Database optimization', 'Add indexes and optimize queries', 'Medium', 'Completed', CURRENT_DATE - INTERVAL '2 days');
