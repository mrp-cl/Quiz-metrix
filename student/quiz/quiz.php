<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Take Quiz</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/styles.css">
    <?php include '../../shared-student/header.php'; ?>
</head>
<body>

<?php
include '../../shared-student/sidebar.php';
include '../../shared-student/navbar.php';
?>
    <div class="container mt-4">
        <div class="quiz-taker">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 id="quizTitle">Quiz Title</h2>
                <div id="timerDisplay" class="d-none">
                    Time remaining: <span id="timer">00:00</span>
                </div>
            </div>
            
            <p id="quizDescription" class="mb-4">Quiz description will appear here.</p>
            
            <!-- Question Container -->
            <div id="questionContainer">
                <!-- Questions will be dynamically inserted here -->
                <div class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading quiz...</p>
                </div>
            </div>
            
            <div class="d-flex justify-content-between mt-4">
                <button class="btn btn-secondary" id="prevBtn">Previous</button>
                <div>
                    <span id="questionProgress">Question 1 of 5</span>
                </div>
                <button class="btn btn-primary" id="nextBtn">Next</button>
            </div>
            
            <div class="text-center mt-4">
                <button class="btn btn-success" id="submitQuizBtn">Submit Quiz</button>
            </div>
        </div>
    </div>

    <!-- Results Modal -->
    <div class="modal fade" id="resultsModal" tabindex="-1" aria-labelledby="resultsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="resultsModalLabel">Quiz Results</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h4 class="text-center mb-4">Your Score</h4>
                    <div class="text-center">
                        <h2 id="scoreDisplay">0/0</h2>
                        <p id="percentageDisplay">0%</p>
                    </div>
                    <div id="answerReview" class="mt-4">
                        <!-- Answer review will be inserted here -->
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="index.php" class="btn btn-secondary">Back to Home</a>
                    <button type="button" class="btn btn-primary" id="retakeQuizBtn">Retake Quiz</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/quiz-script.js"></script>
    <?php include '../../shared-student/script.php'; ?>

</body>
</html>
