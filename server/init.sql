USE minesweeper;

-- Create the usernames table
CREATE TABLE usernames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optionally, insert some initial usernames
INSERT INTO usernames (username) VALUES
('user1'),
('user2'),
('user3');