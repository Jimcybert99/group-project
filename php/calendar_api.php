<?php
// calendar_api.php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "bariatric_portal"); // ← Update this

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$action = $_GET['action'] ?? '';

if ($action === 'get_logs') {
    $result = $conn->query("
        SELECT date, exercise_name 
        FROM workout_details 
        ORDER BY date
    ");

    $logs = [];

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
} elseif ($action === 'add') {
    $date = $_POST['date'] ?? '';
    $time = $_POST['time'] ?? '';
    $desc = $_POST['desc'] ?? '';

    if (!$date || !$time || !$desc) {
        http_response_code(400);
        echo json_encode(["error" => "Missing data"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO calendar_events (event_date, event_time, description) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $date, $time, $desc);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Insert failed", "mysqli_error" => $stmt->error]);
    }


} elseif ($action === 'delete') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $input['id'] ?? '';
        if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing ID"]);
        exit();
    }
    $stmt = $conn->prepare("DELETE FROM calendar_events WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Delete failed", "mysqli_error" => $stmt->error]);
    }
    

} elseif ($action === 'workouts') {
    $result = $conn->query("SELECT date, exercise_name FROM workout_details ORDER BY date");
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $date = $row['date'];
        $name = $row['exercise_name'];
        if (!isset($data[$date])) {
            $data[$date] = [];
        }
        if (!in_array($name, $data[$date])) {
            $data[$date][] = $name;
        }
    }

    echo json_encode($data);

} elseif ($action === 'fetch') {
    $result = $conn->query("SELECT id, event_date, event_time, description FROM calendar_events ORDER BY event_date, event_time");
    $events = [];

    while ($row = $result->fetch_assoc()) {
        $date = $row['event_date'];
        if (!isset($events[$date])) {
            $events[$date] = [];
        }
        $events[$date][] = [
            "id" => $row['id'],
            "time" => $row['event_time'],
            "text" => $row['description']
        ];
    }

    echo json_encode($events);
    exit();

} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid action"]);
}
?>
