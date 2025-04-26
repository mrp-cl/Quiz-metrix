<?php
require_once('../includes/db_config.php');

// Get quiz ID from request
$quiz_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($quiz_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid quiz ID']);
    exit;
}

// Delete quiz (questions will be deleted via ON DELETE CASCADE)
$stmt = $conn->prepare("DELETE FROM quizzes WHERE quiz_id = ?");
$stmt->bind_param("i", $quiz_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$conn->close();
?>
