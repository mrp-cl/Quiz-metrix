document.addEventListener('DOMContentLoaded', function() {
    // Goal Modal
    const goalModal = document.getElementById('goalModal');
    
    // Load current goal
    loadCurrentGoal();
    
    // Set goal button
    document.getElementById('setGoalBtn').addEventListener('click', function() {
        goalModal.classList.add('active');
    });
    
    // Save goal
    document.getElementById('saveGoalBtn').addEventListener('click', function() {
        saveGoal();
    });
    
    // Achieved button
    document.getElementById('achievedBtn').addEventListener('click', function() {
        markGoalAchieved();
    });
    
    // Function to load current goal
    function loadCurrentGoal() {
        fetch('api/goals.php?action=getCurrentGoal')
            .then(response => response.json())
            .then(data => {
                const currentGoalContainer = document.getElementById('current-goal');
                const noGoalContainer = document.getElementById('no-goal');
                
                if (data && !data.is_achieved) {
                    // Display current goal
                    updateGoalUI(data);
                    currentGoalContainer.style.display = 'block';
                    noGoalContainer.style.display = 'none';
                } else {
                    // No active goal
                    currentGoalContainer.style.display = 'none';
                    noGoalContainer.style.display = 'block';
                }
            })
            .catch(error => console.error('Error loading current goal:', error));
    }
    
    // Function to update goal UI
    function updateGoalUI(goal) {
        const targetDate = new Date(goal.target_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Calculate days remaining
        const timeDiff = targetDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        // Calculate progress percentage
        const createdDate = new Date(goal.created_at);
        const totalDays = Math.ceil((targetDate.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
        const daysPassed = Math.ceil((today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
        let progressPercentage = Math.min(Math.round((daysPassed / totalDays) * 100), 100);
        
        // Format target date
        const formattedDate = targetDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        // Update UI elements
        document.getElementById('goalTitle').textContent = goal.title;
        document.getElementById('goalTarget').textContent = `Target: ${formattedDate}`;
        document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
        document.getElementById('progressFill').style.width = `${progressPercentage}%`;
        document.getElementById('daysRemaining').textContent = `${daysRemaining} days remaining`;
    }
    
    // Function to save a goal
    function saveGoal() {
        const goalTitle = document.getElementById('goalTitleInput').value;
        const goalDate = document.getElementById('goalDateInput').value;
        
        if (!goalTitle || !goalDate) {
            alert('Please fill in all required fields');
            return;
        }
        
        const goalData = {
            title: goalTitle,
            target_date: goalDate
        };
        
        fetch('api/goals.php?action=addGoal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(goalData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                goalModal.classList.remove('active');
                loadCurrentGoal();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error saving goal:', error));
    }
    
    // Function to mark a goal as achieved
    function markGoalAchieved() {
        if (!confirm('Are you sure you want to mark this goal as achieved?')) {
            return;
        }
        
        fetch('api/goals.php?action=markAchieved', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadCurrentGoal();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error marking goal as achieved:', error));
    }
});