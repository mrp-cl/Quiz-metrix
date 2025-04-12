<div class="main-content">

    <div class="dashboard-grid">
        <!-- Main Calendar Section -->
        <div class="calendar-section">
            <div class="card calendar-card">
                <div class="card-header">
                    <h3>Calendar</h3>
                    <button id="addEventBtn" class="btn primary-btn">
                        <i class="fas fa-plus"></i> Add Event
                    </button>
                </div>
                <div class="card-body">
                    <div id="calendar"></div>
                </div>
            </div>
        </div>

        <!-- Events Section -->
        <div class="events-section">
            <div class="card past-events-card">
                <div class="card-header" id="pastHeader">
                    <h3><i class="fas fa-history"></i> Past Events</h3>
                    <p>Last 7 days</p>
                </div>
                <div class="card-body" id="pastEvents">
                    <!-- Past events will be displayed here -->
                </div>
            </div>

            <div class="card current-events-card">
                <div class="card-header" id="currentHeader">
                    <h3><i class="fas fa-calendar-day"></i> Current Events</h3>
                    <p id="currentDate"></p>
                </div>
                <div class="card-body" id="currentEvents">
                    <!-- Current events will be displayed here -->
                </div>
            </div>

            <div class="card upcoming-events-card">
                <div class="card-header" id="upcomingHeader">
                    <h3><i class="fas fa-calendar-alt"></i> Upcoming Events</h3>
                    <p>Next 7 days</p>
                </div>
                <div class="card-body" id="upcomingEvents">
                    <!-- Upcoming events will be displayed here -->
                </div>
            </div>
        </div>

        <!-- Tools Section -->
        <div class="tools-section">
            <div class="card goal-card">
                <div class="card-header" id="goalHeader">
                    <h3><i class="fas fa-bullseye"></i> Goal Tracker</h3>
                    <p>Track your progress towards your goal</p>
                </div>
                <div class="card-body">
                    <h4 id="goalTitle">Complete Final Project</h4>
                    <p id="goalTarget" class="text-muted">Target: April 30, 2025</p>

                    <div class="progress-container">
                        <div class="progress-label">
                            <span>Progress</span>
                            <span id="progressPercentage">40%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill" style="width: 40%"></div>
                        </div>
                    </div>

                    <p id="daysRemaining" class="text-muted">26 days remaining</p>
                </div>
                <div class="card-footer">
                    <button id="setGoalBtn" class="btn outline-btn">Set New Goal</button>
                    <button id="achievedBtn" class="btn primary-btn">Achieved</button>
                </div>
            </div>

            <div class="card timer-card">
                <div class="card-header" id="studyTimerHeader">
                    <h3><i class="fas fa-clock"></i> Study Timer</h3>
                    <p>Focus on your studies with timed sessions</p>
                </div>
                <div class="card-body">
                    <div class="timer-tabs">
                        <button class="timer-tab active" data-tab="study">Study</button>
                        <button class="timer-tab" data-tab="break">Break</button>
                    </div>

                    <div class="timer-display">
                        <span id="timerDisplay">25:00</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button id="startPauseBtn" class="btn primary-btn">
                        <i class="fas fa-play"></i> Start
                    </button>
                    <div class="resetAndSettings">
                        <button id="resetBtn" class="btn icon-btn">
                            <i class="fas fa-redo"></i>
                        </button>
                        <button id="settingsBtn" class="btn icon-btn">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="card todo-card">
                <div class="card-header" id="todoHeader">
                    <h3><i class="fas fa-tasks"></i> To-Do List</h3>
                    <p>Manage your tasks and stay organized</p>
                </div>
                <div class="card-body">
                    <div class="todo-input">
                        <input type="text" id="newTodoInput" placeholder="Add a new task...">
                        <button id="addTodoBtn" class="btn icon-btn">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>

                    <ul class="todo-list" id="todoList">
                        <!-- Todo items will be generated here -->
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal for Adding/Editing Events -->
<div class="modal" id="eventModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="eventModalTitle">Add New Event</h3>
            <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
            <input type="hidden" id="eventId">
            <div class="form-group">
                <label for="eventTitle">Event Title</label>
                <input type="text" id="eventTitle" placeholder="Enter event title">
            </div>
            <div class="form-group">
                <label for="eventDate">Date</label>
                <input type="date" id="eventDate">
            </div>
        </div>
        <div class="modal-footer">
            <button id="deleteEventBtn" class="btn delete-btn" style="display: none;">Delete</button>
            <button id="saveEventBtn" class="btn primary-btn">Save Event</button>
        </div>
    </div>
</div>

<!-- Modal for Setting Goals -->
<div class="modal" id="goalModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Set a New Goal</h3>
            <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label for="goalTitleInput">Goal Title</label>
                <input type="text" id="goalTitleInput" placeholder="Enter your goal">
            </div>
            <div class="form-group split">
                <div>
                    <label for="timeframeInput">Timeframe</label>
                    <input type="number" id="timeframeInput" min="1" value="30">
                </div>
                <div>
                    <label for="timeframeUnit">Unit</label>
                    <select id="timeframeUnit">
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button id="saveGoalBtn" class="btn primary-btn">Save Goal</button>
        </div>
    </div>
</div>

<!-- Modal for Timer Settings -->
<div class="modal" id="timerModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Timer Settings</h3>
            <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label for="studyTimeInput">Study Time (minutes)</label>
                <div class="slider-container">
                    <input type="range" id="studyTimeInput" min="5" max="60" step="5" value="25">
                    <span id="studyTimeValue">25</span>
                </div>
            </div>
            <div class="form-group">
                <label for="breakTimeInput">Break Time (minutes)</label>
                <div class="slider-container">
                    <input type="range" id="breakTimeInput" min="1" max="30" step="1" value="5">
                    <span id="breakTimeValue">5</span>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button id="saveTimerBtn" class="btn primary-btn">Save Settings</button>
        </div>
    </div>
</div> 
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<?php 
    // require dirname(dirname(__DIR__));
    require dirname(dirname(__DIR__)) . '/database/config.php';

    $database = new Database(); 
    $conn = $database->getConnection(); 
    $schedules = $conn->query("SELECT * FROM `tbl_event`");
    $sched_res = [];
    foreach($schedules->fetch_all(MYSQLI_ASSOC) as $row){
        $row['sdate'] = date('Y-m-d', strtotime($row['start_date']));
        $row['edate'] = date('Y-m-d',strtotime($row['end_date']));
        $sched_res[$row['id']] = $row;
    }

    ?>


 <script>
      var scheds = $.parseJSON('<?= json_encode($sched_res) ?>') 
      console.log(scheds);
</script>