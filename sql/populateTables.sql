-- Sample events
INSERT INTO calendar_events (event_date, event_time, description) VALUES
('2025-05-03', '09:00:00', 'Follow-up with dietitian'),
('2025-05-03', '07:30:00', 'Morning walk with support group'),
('2025-05-05', '18:00:00', 'Virtual mindfulness session'),
('2025-05-08', '14:00:00', 'Check-in call with health coach'),
('2025-05-10', '08:00:00', 'Blood pressure screening'),
('2025-05-12', '12:00:00', 'Meal prep workshop'),
('2025-05-04', '10:00:00', 'Support group brunch'),
('2025-05-06', '09:00:00', 'Weekly weigh-in'),
('2025-05-07', '15:30:00', 'Meal planning check-in'),
('2025-05-09', '08:30:00', 'Stretch and mobility session'),
('2025-05-11', '18:00:00', 'Evening meditation'),
('2025-05-14', '13:00:00', 'Nutrition label workshop'),
('2025-05-16', '16:00:00', 'One-on-one coaching'),
('2025-05-19', '11:00:00', 'Check-in with care coordinator'),
('2025-05-23', '09:30:00', 'Community walking challenge'),
('2025-05-28', '17:30:00', 'Healthy habits review'),
('2025-05-15', '10:30:00', 'Hydration challenge kickoff'),
('2025-05-18', '19:00:00', 'Yoga for beginners'),
('2025-05-21', '17:00:00', 'Group Q&A with bariatric surgeon'),
('2025-05-25', '13:00:00', 'Protein shake demo & tasting');

  
INSERT INTO workout_details (date, exercise_name, type, distance, time_minutes, sets, reps, weight) VALUES
('2025-04-05', 'Biking', 'Cardio', 3.5, 25, NULL, NULL, NULL),
('2025-04-06', 'Chair Squats', 'Weighted', NULL, NULL, 4, 12, 10),
('2025-04-07', 'Walking', 'Cardio', 1.8, 27, NULL, NULL, NULL),
('2025-04-08', 'Pushups', 'Weighted', NULL, NULL, 3, 10, 0),
('2025-04-10', 'Biking', 'Cardio', 4.0, 35, NULL, NULL, NULL),
('2025-04-17', 'Walking', 'Cardio', 1.5, 25, NULL, NULL, NULL),
('2025-04-18', 'Chair Squats', 'Weighted', NULL, NULL, 3, 10, 0),
('2025-04-21', 'Walking', 'Cardio', 1.8, 28, NULL, NULL, NULL),
('2025-04-24', 'Chair Squats', 'Weighted', NULL, NULL, 4, 12, 0),
('2025-04-25', 'Walking', 'Cardio', 2.0, 30, NULL, NULL, NULL),
('2025-03-29', 'Chair Squats', 'Weighted', NULL, NULL, 5, 14, 0),
('2025-05-01', 'Walking', 'Cardio', 2.0, 30, NULL, NULL, NULL),
('2025-05-02', 'Running', 'Cardio', 1.2, 15, NULL, NULL, NULL),
('2025-05-03', 'Chair Squats', 'Weighted', NULL, NULL, 4, 10, 10),
('2025-05-03', 'Pushups', 'Weighted', NULL, NULL, 3, 12, 0),
('2025-05-04', 'Lunges', 'Weighted', NULL, NULL, 3, 10, 10),
('2025-05-05', 'Biking', 'Cardio', 3.5, 25, NULL, NULL, NULL),
('2025-05-06', 'Chair Squats', 'Weighted', NULL, NULL, 4, 12, 10),
('2025-05-07', 'Walking', 'Cardio', 1.8, 27, NULL, NULL, NULL),
('2025-05-08', 'Pushups', 'Weighted', NULL, NULL, 3, 10, 0),
('2025-05-10', 'Biking', 'Cardio', 4.0, 35, NULL, NULL, NULL);


INSERT INTO exercise_library (name, type) VALUES
  ('Walking', 'Cardio'),
  ('Running', 'Cardio'),
  ('Biking', 'Cardio'),
  ('Chair Squats', 'Weighted'),
  ('Pushups', 'Weighted'),
  ('Lunges', 'Weighted');


INSERT INTO mood_entries (user_id, mood, energy, stress, journal) VALUES
(1, 'Happy', 8, 3, 'Felt motivated and had a productive workout.'),
(2, 'Anxious', 5, 7, 'Worried about upcoming exams but still managed a walk.');


