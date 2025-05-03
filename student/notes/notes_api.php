<?php
// Include database configuration
require_once 'db_config.php';

// Set header to return JSON
header('Content-Type: application/json');

// Handle different actions based on request
$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');

switch ($action) {
    case 'create':
        createNote();
        break;
    case 'read':
        readNotes();
        break;
    case 'update':
        updateNote();
        break;
    case 'delete':
        deleteNote();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

// Create a new note
function createNote() {
    global $conn;
    
    // Get data from POST request
    $title = isset($_POST['title']) ? $_POST['title'] : '';
    $content = isset($_POST['content']) ? $_POST['content'] : '';
    $color = isset($_POST['color']) ? $_POST['color'] : 'default'; // Add color parameter
    
    // Validate content
    if (empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Note content is required']);
        return;
    }
    
    // Prepare and execute query
    $stmt = $conn->prepare("INSERT INTO notes (title, content, color, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $title, $content, $color);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Note created successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error creating note: ' . $conn->error]);
    }
    
    $stmt->close();
}

// Read all notes
function readNotes() {
    global $conn;
    
    // Prepare and execute query
    $result = $conn->query("SELECT * FROM notes ORDER BY created_at DESC");
    
    if ($result) {
        $notes = [];
        while ($row = $result->fetch_assoc()) {
            $notes[] = $row;
        }
        echo json_encode(['success' => true, 'notes' => $notes]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error fetching notes: ' . $conn->error]);
    }
}

// Update a note
function updateNote() {
    global $conn;
    
    // Get data from POST request
    $id = isset($_POST['id']) ? $_POST['id'] : '';
    $title = isset($_POST['title']) ? $_POST['title'] : '';
    $content = isset($_POST['content']) ? $_POST['content'] : '';
    $color = isset($_POST['color']) ? $_POST['color'] : 'default'; // Add color parameter
    
    // Validate data
    if (empty($id) || empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Note ID and content are required']);
        return;
    }
    
    // Prepare and execute query
    $stmt = $conn->prepare("UPDATE notes SET title = ?, content = ?, color = ?, updated_at = NOW() WHERE id = ?");
    $stmt->bind_param("sssi", $title, $content, $color, $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Note updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating note: ' . $conn->error]);
    }
    
    $stmt->close();
}

// Delete a note
function deleteNote() {
    global $conn;
    
    // Get data from POST request
    $id = isset($_POST['id']) ? $_POST['id'] : '';
    
    // Validate data
    if (empty($id)) {
        echo json_encode(['success' => false, 'message' => 'Note ID is required']);
        return;
    }
    
    // Prepare and execute query
    $stmt = $conn->prepare("DELETE FROM notes WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Note deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting note: ' . $conn->error]);
    }
    
    $stmt->close();
}
?>
