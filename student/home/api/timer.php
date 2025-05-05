<?php
// Database connection
require_once '../db_connect.php';

// Set headers
header('Content-Type: application/json');

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch ($action) {
    case 'getTimerState':
        getTimerState($conn);
        break;
    case 'startTimer':
        startTimer($conn);
        break;
    case 'pauseTimer':
        pauseTimer($conn);
        break;
    case 'resetTimer':
        resetTimer($conn);
        break;
    case 'updateSettings':
        updateSettings($conn);
        break;
    case 'getSettings':
        getSettings($conn);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

// Function to get the current timer state
function getTimerState($conn) {
    // Get the most recent active timer session
    $stmt = $conn->prepare("SELECT * FROM timer_sessions ORDER BY session_id DESC LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $timerState = $result->fetch_assoc();
        
        // If timer is running, calculate the current time left
        if ($timerState['is_running'] == 1 && $timerState['start_time'] !== null) {
            $startTime = strtotime($timerState['start_time']);
            $currentTime = time();
            $elapsedSeconds = $currentTime - $startTime;
            $timeLeft = max(0, $timerState['time_left'] - $elapsedSeconds);
            
            // Update the time left in the database
            $updateStmt = $conn->prepare("UPDATE timer_sessions SET time_left = ? WHERE session_id = ?");
            $updateStmt->bind_param("ii", $timeLeft, $timerState['session_id']);
            $updateStmt->execute();
            
            $timerState['time_left'] = $timeLeft;
            
            // If timer has reached zero, mark it as not running
            if ($timeLeft <= 0) {
                $updateStmt = $conn->prepare("UPDATE timer_sessions SET is_running = 0, time_left = 0 WHERE session_id = ?");
                $updateStmt->bind_param("i", $timerState['session_id']);
                $updateStmt->execute();
                $timerState['is_running'] = 0;
            }
        }
        
        echo json_encode($timerState);
    } else {
        // Get default settings
        $stmt = $conn->prepare("SELECT * FROM timer_settings ORDER BY setting_id DESC LIMIT 1");
        $stmt->execute();
        $settings = $stmt->get_result()->fetch_assoc();
        
        // Create a new timer session with default values
        $mode = 'study';
        $duration = $settings['study_duration'];
        $timeLeft = $duration;
        $isRunning = 0;
        
        $stmt = $conn->prepare("INSERT INTO timer_sessions (mode, duration, time_left, is_running) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("siii", $mode, $duration, $timeLeft, $isRunning);
        $stmt->execute();
        $sessionId = $conn->insert_id;
        
        echo json_encode([
            'session_id' => $sessionId,
            'mode' => $mode,
            'duration' => $duration,
            'time_left' => $timeLeft,
            'is_running' => $isRunning,
            'start_time' => null
        ]);
    }
}

// Function to start the timer
function startTimer($conn) {
    // Get data from request
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['session_id']) || !isset($data['time_left'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    $sessionId = $data['session_id'];
    $timeLeft = $data['time_left'];
    $currentTime = date('Y-m-d H:i:s');
    
    // Update the timer session
    $stmt = $conn->prepare("UPDATE timer_sessions SET is_running = 1, time_left = ?, start_time = ? WHERE session_id = ?");
    $stmt->bind_param("isi", $timeLeft, $currentTime, $sessionId);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Timer started', 
            'start_time' => $currentTime
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error starting timer: ' . $conn->error]);
    }
}

// Function to pause the timer
function pauseTimer($conn) {
    // Get data from request
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['session_id']) || !isset($data['time_left'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    $sessionId = $data['session_id'];
    $timeLeft = $data['time_left'];
    
    // Update the timer session
    $stmt = $conn->prepare("UPDATE timer_sessions SET is_running = 0, time_left = ?, start_time = NULL WHERE session_id = ?");
    $stmt->bind_param("ii", $timeLeft, $sessionId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Timer paused']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error pausing timer: ' . $conn->error]);
    }
}

// Function to reset the timer
function resetTimer($conn) {
    // Get data from request
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['mode'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    $mode = $data['mode'];
    
    // Get the duration from settings
    $stmt = $conn->prepare("SELECT * FROM timer_settings ORDER BY setting_id DESC LIMIT 1");
    $stmt->execute();
    $settings = $stmt->get_result()->fetch_assoc();
    
    $duration = ($mode === 'study') ? $settings['study_duration'] : $settings['break_duration'];
    $timeLeft = $duration;
    $isRunning = 0;
    
    // Create a new timer session
    $stmt = $conn->prepare("INSERT INTO timer_sessions (mode, duration, time_left, is_running) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siii", $mode, $duration, $timeLeft, $isRunning);
    
    if ($stmt->execute()) {
        $sessionId = $conn->insert_id;
        echo json_encode([
            'success' => true, 
            'message' => 'Timer reset',
            'session_id' => $sessionId,
            'mode' => $mode,
            'duration' => $duration,
            'time_left' => $timeLeft,
            'is_running' => $isRunning
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error resetting timer: ' . $conn->error]);
    }
}

// Function to update timer settings
function updateSettings($conn) {
    // Get data from request
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['study_duration']) || !isset($data['break_duration'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    $studyDuration = $data['study_duration'];
    $breakDuration = $data['break_duration'];
    
    // Update settings
    $stmt = $conn->prepare("UPDATE timer_settings SET study_duration = ?, break_duration = ? WHERE setting_id = 1");
    $stmt->bind_param("ii", $studyDuration, $breakDuration);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Settings updated']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating settings: ' . $conn->error]);
    }
}

// Function to get timer settings
function getSettings($conn) {
    $stmt = $conn->prepare("SELECT * FROM timer_settings ORDER BY setting_id DESC LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(['success' => false, 'message' => 'No settings found']);
    }
}
?>