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

// Get events
$sql = "SELECT id, title, date as start FROM events";
$result = $conn->query($sql);

$events = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
}

// Return events as JSON
header('Content-Type: application/json');
echo json_encode(['success' => true, 'events' => $events]);

$conn->close();
?>

