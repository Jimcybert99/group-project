

-- Sample events
INSERT INTO calendar_events (event_date, event_time, description) VALUES
('2025-05-01', '09:00:00', 'Follow-up with dietitian'),
('2025-05-03', '07:30:00', 'Morning walk with support group'),
('2025-05-05', '18:00:00', 'Virtual mindfulness session'),
('2025-05-08', '14:00:00', 'Check-in call with health coach'),
('2025-05-10', '08:00:00', 'Blood pressure screening'),
('2025-05-12', '12:00:00', 'Meal prep workshop'),
('2025-05-15', '10:30:00', 'Hydration challenge kickoff'),
('2025-05-18', '19:00:00', 'Yoga for beginners'),
('2025-05-21', '17:00:00', 'Group Q&A with bariatric surgeon'),
('2025-05-25', '13:00:00', 'Protein shake demo & tasting');

  
INSERT INTO workout_details (date, exercise_name, type, distance, time_minutes, sets, reps, weight) VALUES
('2025-04-17', 'Walking', 'Cardio', 1.5, 25, NULL, NULL, NULL),
('2025-04-18', 'Chair Squats', 'Weighted', NULL, NULL, 3, 10, 0),
('2025-04-21', 'Walking', 'Cardio', 1.8, 28, NULL, NULL, NULL),
('2025-04-24', 'Chair Squats', 'Weighted', NULL, NULL, 4, 12, 0),
('2025-04-25', 'Walking', 'Cardio', 2.0, 30, NULL, NULL, NULL),
('2025-04-29', 'Chair Squats', 'Weighted', NULL, NULL, 5, 14, 0);

INSERT INTO exercise_library (name, type) VALUES
  ('Walking', 'Cardio'),
  ('Running', 'Cardio'),
  ('Biking', 'Cardio'),
  ('Chair Squats', 'Weighted'),
  ('Pushups', 'Weighted'),
  ('Lunges', 'Weighted');


