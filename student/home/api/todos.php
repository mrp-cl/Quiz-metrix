<?php
// Database connection
require_once '../db_connect.php';

// Set headers
header('Content-Type: application/json');

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch ($action) {
    case 'getTasks':
        getTasks($conn);
        break;
    case 'addTask':
        addTask($conn);
        break;
    case 'updateTask':
        updateTask($conn);
        break;
    case 'deleteTask':
        deleteTask($conn);
        break;
    case 'deleteCompletedTasks':
        deleteCompletedTasks($conn);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

// Function to get all tasks
function getTasks($conn) {
    $stmt = $conn->prepare("SELECT * FROM tasks ORDER BY created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $tasks = [];
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
    
    echo json_encode($tasks);
}

// Function to add a new task
function addTask($conn) {
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['content'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    $content = $data['content'];
    
    $stmt = $conn->prepare("INSERT INTO tasks (content) VALUES (?)");
    $stmt->bind_param("s", $content);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Task added successfully', 'task_id' => $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error adding task: ' . $conn->error]);
    }
}

// Function to update a task
function updateTask($conn) {
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['task_id'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    $taskId = intval($data['task_id']);
    $isCompleted = isset($data['is_completed']) ? intval($data['is_completed']) : 0;
    
    $stmt = $conn->prepare("UPDATE tasks SET is_completed = ? WHERE task_id = ?");
    $stmt->bind_param("ii", $isCompleted, $taskId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Task updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating task: ' . $conn->error]);
    }
}

// Function to delete a task
function deleteTask($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    $stmt = $conn->prepare("DELETE FROM tasks WHERE task_id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Task deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting task: ' . $conn->error]);
    }
}

// Function to delete all completed tasks
function deleteCompletedTasks($conn) {
    $stmt = $conn->prepare("DELETE FROM tasks WHERE is_completed = 1");
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Completed tasks deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting completed tasks: ' . $conn->error]);
    }
}
?>