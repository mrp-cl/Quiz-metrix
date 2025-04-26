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
$text = $_POST['text'];
$completed = isset($_POST['completed']) ? $_POST['completed'] : 0;

// Validate data
if (empty($text)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Prepare and execute SQL statement
$stmt = $conn->prepare("INSERT INTO todos (text, completed) VALUES (?, ?)");
$stmt->bind_param("si", $text, $completed);

if ($stmt->execute()) {
    $id = $conn->insert_id;
    echo json_encode(['success' => true, 'id' => $id, 'message' => 'Todo saved successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error saving todo: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>