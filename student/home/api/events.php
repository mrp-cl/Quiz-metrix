<?php
// Database connection
require_once '../db_connect.php';

// Set headers
header('Content-Type: application/json');

// Get action from request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions
switch ($action) {
    case 'getMonthEvents':
        getMonthEvents($conn);
        break;
    case 'getEventsForDate':
        getEventsForDate($conn);
        break;
    case 'getEvent':
        getEvent($conn);
        break;
    case 'addEvent':
        addEvent($conn);
        break;
    case 'updateEvent':
        updateEvent($conn);
        break;
    case 'deleteEvent':
        deleteEvent($conn);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

// Function to get all events for the current month
function getMonthEvents($conn) {
    $currentMonth = date('Y-m');
    
    $stmt = $conn->prepare("SELECT * FROM events WHERE event_date LIKE ? ORDER BY event_date ASC");
    $likePattern = $currentMonth . '%';
    $stmt->bind_param("s", $likePattern);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    
    echo json_encode($events);
}

// Function to get events for a specific date
function getEventsForDate($conn) {
    $date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
    
    $stmt = $conn->prepare("SELECT * FROM events WHERE event_date = ? ORDER BY event_date ASC");
    $stmt->bind_param("s", $date);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    
    echo json_encode($events);
}

// Function to get a single event
function getEvent($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    $stmt = $conn->prepare("SELECT * FROM events WHERE event_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(['success' => false, 'message' => 'Event not found']);
    }
}

// Function to add a new event
function addEvent($conn) {
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['title']) || !isset($data['event_date'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    $title = $data['title'];
    $description = isset($data['description']) ? $data['description'] : '';
    $eventDate = $data['event_date'];
    
    $stmt = $conn->prepare("INSERT INTO events (title, description, event_date) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $title, $description, $eventDate);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Event added successfully', 'event_id' => $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error adding event: ' . $conn->error]);
    }
}

// Function to update an event
function updateEvent($conn) {
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['event_id']) || !isset($data['title']) || !isset($data['event_date'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    $eventId = $data['event_id'];
    $title = $data['title'];
    $description = isset($data['description']) ? $data['description'] : '';
    $eventDate = $data['event_date'];
    
    $stmt = $conn->prepare("UPDATE events SET title = ?, description = ?, event_date = ? WHERE event_id = ?");
    $stmt->bind_param("sssi", $title, $description, $eventDate, $eventId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Event updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating event: ' . $conn->error]);
    }
}

// Function to delete an event
function deleteEvent($conn) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    $stmt = $conn->prepare("DELETE FROM events WHERE event_id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Event deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting event: ' . $conn->error]);
    }
}
?>