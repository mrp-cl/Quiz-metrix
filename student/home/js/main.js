document.addEventListener('DOMContentLoaded', function() {
    // Set current date in the header
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
    
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-btn');
    
    // Open modals
    document.getElementById('addEventBtn').addEventListener('click', function() {
        openModal('eventModal');
        document.getElementById('eventModalTitle').textContent = 'Add New Event';
        document.getElementById('deleteEventBtn').style.display = 'none';
        document.getElementById('eventId').value = '';
        document.getElementById('eventTitle').value = '';
        
        // Set default date to today
        document.getElementById('eventDate').value = formatDate(new Date());
    });
    
    document.getElementById('setGoalBtn').addEventListener('click', function() {
        openModal('goalModal');
    });
    
    document.getElementById('settingsBtn').addEventListener('click', function() {
        openModal('timerModal');
    });
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Range slider value display
    document.getElementById('studyTimeInput').addEventListener('input', function() {
        document.getElementById('studyTimeValue').textContent = this.value;
    });
    
    document.getElementById('breakTimeInput').addEventListener('input', function() {
        document.getElementById('breakTimeValue').textContent = this.value;
    });
    
    // Helper functions
    function openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
    }
    
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});