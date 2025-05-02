CREATE DATABASE IF NOT EXISTS bariatric_portal;
USE bariatric_portal;

-- Events scheduled by user
CREATE TABLE IF NOT EXISTS calendar_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_date DATE NOT NULL,
  event_time TIME,
  description TEXT NOT NULL
);

-- Track completed workout days
CREATE TABLE IF NOT EXISTS workout_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workout_date DATE NOT NULL,
  completed TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS workout_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  exercise_name VARCHAR(50) NOT NULL,
  type ENUM('Cardio', 'Weighted') NOT NULL,
  distance FLOAT,
  time_minutes INT,
  sets INT,
  reps INT,
  weight FLOAT
);

CREATE TABLE IF NOT EXISTS exercise_library (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type ENUM('Cardio', 'Weighted') NOT NULL
);



