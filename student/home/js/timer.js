document.addEventListener('DOMContentLoaded', function() {
    // Timer elements
    const timerDisplay = document.getElementById('timerDisplay');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const timerTabs = document.querySelectorAll('.timer-tab');
    const timerModal = document.getElementById('timerModal');
    const studyTimeInput = document.getElementById('studyTimeInput');
    const breakTimeInput = document.getElementById('breakTimeInput');
    const studyTimeValue = document.getElementById('studyTimeValue');
    const breakTimeValue = document.getElementById('breakTimeValue');
    const saveTimerBtn = document.getElementById('saveTimerBtn');
    
    // Timer variables
    let timer;
    let timeLeft;
    let isRunning = false;
    let isStudyMode = true;
    let studyTime = 25 * 60; // Default: 25 minutes in seconds
    let breakTime = 5 * 60;  // Default: 5 minutes in seconds
    let startTime; // To track when the timer started
    
    // Load timer settings from localStorage
    loadTimerSettings();
    
    // Load timer state from localStorage
    loadTimerState();
    
    // Timer tabs
    timerTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const mode = this.dataset.tab;
            
            // Only switch if timer is not running
            if (!isRunning) {
                timerTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                isStudyMode = mode === 'study';
                timeLeft = isStudyMode ? studyTime : breakTime;
                updateTimerDisplay(timeLeft);
                saveTimerState();
            }
        });
    });
    
    // Start/Pause button
    startPauseBtn.addEventListener('click', function() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
   
    
    // Reset button
    resetBtn.addEventListener('click', function() {
        resetTimer();
    });
    
    // Settings button
    settingsBtn.addEventListener('click', function() {
        // Update settings modal with current values
        studyTimeInput.value = Math.floor(studyTime / 60);
        breakTimeInput.value = Math.floor(breakTime / 60);
        studyTimeValue.textContent = Math.floor(studyTime / 60);
        breakTimeValue.textContent = Math.floor(breakTime / 60);
        
        timerModal.classList.add('active');
    });
    
    // Save timer settings
    saveTimerBtn.addEventListener('click', function() {
        studyTime = parseInt(studyTimeInput.value) * 60;
        breakTime = parseInt(breakTimeInput.value) * 60;
        
        // Save settings to localStorage
        localStorage.setItem('studyTime', studyTime);
        localStorage.setItem('breakTime', breakTime);
        
        // Reset timer with new values if not running
        if (!isRunning) {
            timeLeft = isStudyMode ? studyTime : breakTime;
            updateTimerDisplay(timeLeft);
            saveTimerState();
        }
        
        timerModal.classList.remove('active');
    });
    
    // Update study time value display
    studyTimeInput.addEventListener('input', function() {
        studyTimeValue.textContent = this.value;
    });
    
    // Update break time value display
    breakTimeInput.addEventListener('input', function() {
        breakTimeValue.textContent = this.value;
    });
    
    // Function to load timer settings from localStorage
    function loadTimerSettings() {
        const savedStudyTime = localStorage.getItem('studyTime');
        const savedBreakTime = localStorage.getItem('breakTime');
        
        if (savedStudyTime) {
            studyTime = parseInt(savedStudyTime);
        }
        
        if (savedBreakTime) {
            breakTime = parseInt(savedBreakTime);
        }
    }
    
    // Function to load timer state from localStorage
    function loadTimerState() {
        const savedTimeLeft = localStorage.getItem('timeLeft');
        const savedIsRunning = localStorage.getItem('isRunning');
        const savedIsStudyMode = localStorage.getItem('isStudyMode');
        const savedStartTime = localStorage.getItem('startTime');
        
        if (savedIsStudyMode !== null) {
            isStudyMode = savedIsStudyMode === 'true';
            updateTimerMode(isStudyMode);
        }
        
        if (savedTimeLeft !== null) {
            if (savedIsRunning === 'true' && savedStartTime) {
                // Calculate elapsed time since the timer was started
                const elapsedSeconds = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
                timeLeft = Math.max(0, parseInt(savedTimeLeft) - elapsedSeconds);
                
                if (timeLeft > 0) {
                    isRunning = true;
                    startTime = Date.now() - (elapsedSeconds * 1000);
                    startTimerCountdown();
                    startPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                } else {
                    // Timer has expired while away
                    timeLeft = isStudyMode ? studyTime : breakTime;
                    isRunning = false;
                    startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
                }
            } else {
                timeLeft = parseInt(savedTimeLeft);
                isRunning = false;
                startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            }
        } else {
            timeLeft = isStudyMode ? studyTime : breakTime;
        }
        
        updateTimerDisplay(timeLeft);
    }
    
    // Function to save timer state to localStorage
    function saveTimerState() {
        localStorage.setItem('timeLeft', timeLeft);
        localStorage.setItem('isRunning', isRunning);
        localStorage.setItem('isStudyMode', isStudyMode);
        if (isRunning && startTime) {
            localStorage.setItem('startTime', startTime);
        } else {
            localStorage.removeItem('startTime');
        }
    }
    
    // Function to start the timer
    function startTimer() {
        isRunning = true;
        startTime = Date.now() - ((timeLeft < (isStudyMode ? studyTime : breakTime) ? (isStudyMode ? studyTime : breakTime) - timeLeft : 0) * 1000);
        startTimerCountdown();
        startPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        saveTimerState();
    }
    
    // Function to start the countdown
    function startTimerCountdown() {
        // Clear any existing timer
        clearInterval(timer);
        
        timer = setInterval(function() {
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            const totalSeconds = isStudyMode ? studyTime : breakTime;
            
            timeLeft = Math.max(0, totalSeconds - elapsedSeconds);
            updateTimerDisplay(timeLeft);
            saveTimerState();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                
                // Play notification sound
                playNotificationSound();
                
                // Show notification
                showNotification();
                
                // Switch modes
                isStudyMode = !isStudyMode;
                updateTimerMode(isStudyMode);
                
                // Reset timer for next mode
                timeLeft = isStudyMode ? studyTime : breakTime;
                updateTimerDisplay(timeLeft);
                startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
                saveTimerState();
            }
        }, 1000);
    }
    
    // Function to pause the timer
    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        saveTimerState();
    }
    
    // Function to reset the timer
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        timeLeft = isStudyMode ? studyTime : breakTime;
        updateTimerDisplay(timeLeft);
        startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        saveTimerState();
    }
    
    // Function to update the timer display
    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
    
    // Function to update the timer mode
    function updateTimerMode(isStudy) {
        timerTabs.forEach(tab => {
            if ((isStudy && tab.dataset.tab === 'study') || 
                (!isStudy && tab.dataset.tab === 'break')) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    // Function to play notification sound
    function playNotificationSound() {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play();
    }
    
    // Function to show notification
    function showNotification() {
        if (Notification.permission === 'granted') {
            const title = isStudyMode ? 'Break Time!' : 'Study Time!';
            const message = isStudyMode ? 'Time to take a break.' : 'Time to focus on your studies.';
            
            new Notification(title, {
                body: message
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && isRunning) {
            // When page becomes visible again, recalculate the time left
            loadTimerState();
        }
    });
    
    // Request notification permission on page load
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});