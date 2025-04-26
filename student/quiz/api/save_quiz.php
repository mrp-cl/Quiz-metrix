<?php
require_once('../includes/db_config.php');

// Get the JSON data from the request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid data format']);
    exit;
}

// Start transaction
$conn->begin_transaction();

try {
    // Prepare quiz data
    $title = $conn->real_escape_string($data['title']);
    $description = $conn->real_escape_string($data['description']);
    $settings = json_encode($data['settings']);
    
    // Check if we're updating an existing quiz
    $quiz_id = isset($data['quiz_id']) ? intval($data['quiz_id']) : 0;
    
    if ($quiz_id > 0) {
        // Update existing quiz
        $stmt = $conn->prepare("UPDATE quizzes SET title = ?, description = ?, settings = ? WHERE quiz_id = ?");
        $stmt->bind_param("sssi", $title, $description, $settings, $quiz_id);
        $stmt->execute();
        
        // Delete existing questions to replace with new ones
        $conn->query("DELETE FROM questions WHERE quiz_id = $quiz_id");
    } else {
        // Insert new quiz
        $stmt = $conn->prepare("INSERT INTO quizzes (title, description, settings) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $title, $description, $settings);
        $stmt->execute();
        $quiz_id = $conn->insert_id;
    }
    
    // Insert questions
    if (!empty($data['questions'])) {
        $stmt = $conn->prepare("INSERT INTO questions (quiz_id, term, description, answer_type, question_order) VALUES (?, ?, ?, ?, ?)");
        
        foreach ($data['questions'] as $index => $question) {
            $term = $conn->real_escape_string($question['term']);
            $desc = $conn->real_escape_string($question['description']);
            $answer_type = $conn->real_escape_string($question['answerType'] ?? 'multiple');
            $order = $index + 1;
            
            $stmt->bind_param("isssi", $quiz_id, $term, $desc, $answer_type, $order);
            $stmt->execute();
        }
    }
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode(['success' => true, 'quiz_id' => $quiz_id]);
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>
