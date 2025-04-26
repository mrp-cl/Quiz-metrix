<?php
require_once('../includes/db_config.php');

// Get quiz ID from request
$quiz_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($quiz_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid quiz ID']);
    exit;
}

// Get results for this quiz
$result = $conn->query("SELECT * FROM results WHERE quiz_id = $quiz_id ORDER BY completed_at DESC");

$results = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $results[] = $row;
    }
}

echo json_encode(['success' => true, 'results' => $results]);

$conn->close();
?>
