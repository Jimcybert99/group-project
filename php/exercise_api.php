<?php
//connect to db
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "bariatric_portal");
//determine action
$action = $_GET['action'] ?? '';

//get exercise list
if ($action === 'fetch') {
    $result = $conn->query("SELECT name, type FROM exercise_library ORDER BY name");
    $exercises = [];

    while ($row = $result->fetch_assoc()) {
        $exercises[] = $row;
    }

    echo json_encode($exercises);

//store day's workout
} elseif ($action === 'log') {
    $data = json_decode(file_get_contents("php://input"), true);

    //insert each entry
    foreach ($data as $item) {
        $stmt = $conn->prepare("
            INSERT INTO workout_details 
            (date, exercise_name, type, distance, time_minutes, sets, reps, weight) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param("sssdiidd", 
            $item['date'], 
            $item['name'], 
            $item['type'], 
            $item['distance'], 
            $item['time'], 
            $item['sets'], 
            $item['reps'], 
            $item['weight']
        );
        $stmt->execute();
    }

    echo json_encode(["success" => true]);
//add new exercise to list
} elseif ($action === 'add') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['name'] ?? '';
    $type = $data['type'] ?? '';

    $stmt = $conn->prepare("INSERT INTO exercise_library (name, type) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $type);
    $stmt->execute();

    echo json_encode(["success" => true]);
//check if exercise has data logged
} elseif ($action === 'check_logs') {
    $name = $_GET['name'] ?? '';
    $stmt = $conn->prepare("SELECT COUNT(*) FROM workout_details WHERE exercise_name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    echo json_encode(["hasLogs" => $count > 0]);

//removed exercise from logs
} elseif ($action === 'delete') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $data['name'] ?? '';

    $stmt1 = $conn->prepare("DELETE FROM workout_details WHERE exercise_name = ?");
    $stmt1->bind_param("s", $name);
    $stmt1->execute();

    // Delete from exercise library
    $stmt2 = $conn->prepare("DELETE FROM exercise_library WHERE name = ?");
    $stmt2->bind_param("s", $name);
    $stmt2->execute();

    echo json_encode(["success" => true]);

//exercises with data
} elseif ($action === 'with_logs') {
    $res = $conn->query("
        SELECT DISTINCT wd.exercise_name AS name, el.type
        FROM workout_details wd
        JOIN exercise_library el ON wd.exercise_name = el.name
        ORDER BY wd.exercise_name
    ");
    $names = [];
    while ($row = $res->fetch_assoc()) {
        $names[] = $row;
    }
    echo json_encode($names);

//workout data for the graph
} elseif ($action === 'progress') {
    $name = trim($_GET['name'] ?? '');

    //get workout entries for this exercise
    $stmt = $conn->prepare("SELECT date, type, distance, time_minutes, sets, reps, weight FROM workout_details WHERE exercise_name = ? ORDER BY date");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();

    $aggregated = [];//store workouts by date

    while ($row = $result->fetch_assoc()) {
        $date = $row['date'];
        $type = $row['type'];
        //set to zeros (wont be displayed)
        if (!isset($aggregated[$date])) {
            $aggregated[$date] = [
                "date" => $date,
                "type" => $type,
                "distance" => 0,
                "time" => 0,
                "sets" => 0,
                "reps" => 0,
                "weight" => 0,
                "volume" => 0,
                "total_reps" => 0,
                "best_weight" => 0
            ];
        }
        //cardio metrics
        if ($type === "Cardio") {
            $aggregated[$date]['distance'] += $row['distance'] ?? 0;
            $aggregated[$date]['time'] += $row['time_minutes'] ?? 0;
        } else {//weighted metrics
        $reps = $row['reps'] ?? 0;
        $weight = $row['weight'] ?? 0;

        $aggregated[$date]['sets'] += 1; //each row is one set
        $aggregated[$date]['reps'] += $reps;
        $aggregated[$date]['total_reps'] += $reps;
        $aggregated[$date]['volume'] += $reps * $weight;
        $aggregated[$date]['best_weight'] = max($aggregated[$date]['best_weight'], $weight);

        }
    }

    //Flatten to indexed array
    echo json_encode(array_values($aggregated));
}
?>
