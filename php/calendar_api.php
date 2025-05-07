<?php
// calendar_api.php
header('Content-Type: application/json');
//connect to db
$conn = new mysqli("localhost", "root", "", "bariatric_portal");
//detemine operation to run
$action = $_GET['action'] ?? '';
//get wortouts by date
if ($action === 'get_logs') {
    $result = $conn->query("
        SELECT date, exercise_name 
        FROM workout_details 
        ORDER BY date
    ");

    $logs = [];
    //group by date
    while ($row = $result->fetch_assoc()) {
        $date = $row['date'];
        $name = $row['exercise_name'];
        if (!isset($logs[$date])) {
            $logs[$date] = [];
        }
        $logs[$date][] = $name;
    }
    echo json_encode($logs);
    exit();

//insert calendar event
} elseif ($action === 'add') {
    $date = $_POST['date'] ?? '';
    $time = $_POST['time'] ?? '';
    $desc = $_POST['desc'] ?? '';
    //insert into calendar_event table
    $stmt = $conn->prepare("INSERT INTO calendar_events (event_date, event_time, description) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $date, $time, $desc);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    }

//delete calendar_event
} elseif ($action === 'delete') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $input['id'] ?? '';

    //delete by ID
    $stmt = $conn->prepare("DELETE FROM calendar_events WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    }
//get exercise names by date
} elseif ($action === 'workouts') {
    $result = $conn->query("SELECT date, exercise_name FROM workout_details ORDER BY date");
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $date = $row['date'];
        $name = $row['exercise_name'];
        if (!isset($data[$date])) {
            $data[$date] = [];
        }
        //no duplicates
        if (!in_array($name, $data[$date])) {
            $data[$date][] = $name;
        }
    }

    echo json_encode($data);
//fetch sorted calendar_events by time
} elseif ($action === 'fetch') {
    $result = $conn->query("SELECT id, event_date, event_time, description FROM calendar_events ORDER BY event_date, event_time");
    $events = [];

    while ($row = $result->fetch_assoc()) {
        $date = $row['event_date'];
        if (!isset($events[$date])) {
            $events[$date] = [];
        }
        //group by date
        $events[$date][] = [
            "id" => $row['id'],
            "time" => $row['event_time'],
            "text" => $row['description']
        ];
    }
    echo json_encode($events);
    exit();
}
?>
