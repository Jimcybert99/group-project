-- Create the database
CREATE DATABASE bariatric_portal;

-- Use the new database
USE bariatric_portal;

-- Table to store scheduled events
CREATE TABLE calendar_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_date DATE NOT NULL,
  event_time TIME,
  description TEXT NOT NULL
);

-- Table to track which days have completed workouts
CREATE TABLE workout_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workout_date DATE NOT NULL,
  completed TINYINT(1) DEFAULT 0
);
