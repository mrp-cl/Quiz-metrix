<?php
require_once('../includes/db_config.php');

// Get the JSON data from the request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!$data || !isset($data['quiz_id']) || !isset($data['score']) || !isset($data['total_questions'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid data format']);
    exit;
}

// Insert result
$quiz_id = intval($data['quiz_id']);
$score = intval($data['score']);
$total_questions = intval($data['total_questions']);

$stmt = $conn->prepare("INSERT INTO results (quiz_id, score, total_questions) VALUES (?, ?, ?)");
$stmt->bind_param("iii", $quiz_id, $score, $total_questions);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'result_id' => $conn->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$conn->close();
?>
