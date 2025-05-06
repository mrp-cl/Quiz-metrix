CREATE DATABASE IF NOT EXISTS quiz_metrix;

USE quiz_metrix;

-- Events table
CREATE TABLE `events`  (
  `event_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    target_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_achieved BOOLEAN DEFAULT FALSE
);

-- Add timer_sessions table to store timer states
CREATE TABLE IF NOT EXISTS timer_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    mode VARCHAR(10) NOT NULL DEFAULT 'study',
    duration INT NOT NULL,
    time_left INT NOT NULL,
    is_running TINYINT(1) NOT NULL DEFAULT 0,
    start_time TIMESTAMP NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add timer_settings table to store user preferences
CREATE TABLE IF NOT EXISTS timer_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    study_duration INT NOT NULL DEFAULT 1500,
    break_duration INT NOT NULL DEFAULT 300,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default timer settings
INSERT INTO timer_settings (study_duration, break_duration) VALUES (1500, 300);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    settings JSON
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    term VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    answer_type VARCHAR(50) NOT NULL,
    question_order INT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);