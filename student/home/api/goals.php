<?php
// Database connection
require_once '../db_connect.php';

// Set headers
header('Content-Type: application/json');

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch ($action) {
    case 'getCurrentGoal':
        getCurrentGoal($conn);
        break;
    case 'addGoal':
        addGoal($conn);
        break;
    case 'markAchieved':
        markAchieved($conn);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

// Function to get the current active goal
function getCurrentGoal($conn) {
    $stmt = $conn->prepare("SELECT * FROM goals WHERE is_achieved = 0 ORDER BY created_at DESC LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(null);
    }
}

// Function to add a new goal
function addGoal($conn) {
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['title']) || !isset($data['target_date'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    $title = $data['title'];
    $targetDate = $data['target_date'];
    
    // First, mark all existing goals as achieved
    $stmt = $conn->prepare("UPDATE goals SET is_achieved = 1 WHERE is_achieved = 0");
    $stmt->execute();
    
    // Then add the new goal
    $stmt = $conn->prepare("INSERT INTO goals (title, target_date) VALUES (?, ?)");
    $stmt->bind_param("ss", $title, $targetDate);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Goal added successfully', 'goal_id' => $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error adding goal: ' . $conn->error]);
    }
}

// Function to mark a goal as achieved
function markAchieved($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    $stmt = $conn->prepare("UPDATE goals SET is_achieved = 1 WHERE goal_id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Goal marked as achieved']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating goal: ' . $conn->error]);
    }
}
?>