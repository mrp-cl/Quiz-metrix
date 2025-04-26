<?php
// Database connection
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "quizmetrix";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from POST request
$title = $_POST['title'];
$timeframe = $_POST['timeframe'];
$timeframeUnit = $_POST['timeframeUnit'];
$startDate = $_POST['startDate'];
$targetDate = $_POST['targetDate'];
$progress = isset($_POST['progress']) ? $_POST['progress'] : 0;

// Validate data
if (empty($title) || empty($timeframe) || empty($timeframeUnit) || empty($startDate) || empty($targetDate)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Prepare and execute SQL statement
$stmt = $conn->prepare("INSERT INTO goals (title, timeframe, timeframe_unit, start_date, target_date, progress) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sisssi", $title, $timeframe, $timeframeUnit, $startDate, $targetDate, $progress);

if ($stmt->execute()) {
    $id = $conn->insert_id;
    echo json_encode(['success' => true, 'id' => $id, 'message' => 'Goal saved successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error saving goal: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>