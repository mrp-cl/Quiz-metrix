document.addEventListener("DOMContentLoaded", () => {
    // Initialize all components
    initCalendar()
    initEvents()
    initGoalTracker()
    initStudyTimer()
    initTodoList()
    initModals()
  })
  
  // Sample data
  const events = [
    { id: "1", title: "Team Meeting", start: "2025-04-04" },
    { id: "2", title: "Project Deadline", start: "2025-04-06" },
    { id: "3", title: "Client Payment", start: "2025-04-02" },
    { id: "4", title: "Subscription Renewal", start: "2025-04-01" },
  ]
  
  const todos = [
    { id: "1", text: "School - Tapusin Dashboard", completed: true },
    { id: "2", text: "Wallet - MacD", completed: true },
    { id: "3", text: "Transfer - Refund", completed: true },
    { id: "4", text: "Credit Card - Ordered Food", completed: false },
    { id: "5", text: "Wallet - Starbucks", completed: false },
  ]
  
  // Global variables
  let calendar
  let selectedEvent = null
  let selectedDate = new Date()
  
  // FullCalendar Component
  function initCalendar() {
    const calendarEl = document.getElementById("calendar")
  
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      events: getFormattedEvents(),
      eventClick: (info) => {
        openEditEventModal(info.event)
      },
      dateClick: (info) => {
        selectedDate = new Date(info.dateStr)
        openAddEventModal(info.dateStr)
        renderEvents() // Update events to show selected date
      },
      datesSet: (info) => {
        renderEvents() // Update events when calendar view changes
      },
    })
  
    calendar.render()
  }
  
  // Format events for FullCalendar with appropriate classes
  function getFormattedEvents() {
    return events.map((event) => {
      const eventDate = new Date(event.start)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
  
      const oneWeekAgo = new Date(today)
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
      const oneWeekFromNow = new Date(today)
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
  
      let eventClass
      if (eventDate.getTime() === today.getTime()) {
        eventClass = "current-event"
      } else if (eventDate < today) {
        eventClass = "past-event"
      } else {
        eventClass = "upcoming-event"
      }
  
      return {
        id: event.id,
        title: event.title,
        start: event.start,
        className: eventClass,
      }
    })
  }
  
  // Events Component
  function initEvents() {
    const currentDateElement = document.getElementById("currentDate")
  
    // Set current date
    const today = new Date()
    currentDateElement.textContent = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(today)
  
    // Render events
    renderEvents()
  }
  
  // Render events in the three event sections
  function renderEvents() {
    const pastEventsContainer = document.getElementById("pastEvents")
    const currentEventsContainer = document.getElementById("currentEvents")
    const upcomingEventsContainer = document.getElementById("upcomingEvents")
  
    // Clear containers
    pastEventsContainer.innerHTML = ""
    currentEventsContainer.innerHTML = ""
    upcomingEventsContainer.innerHTML = ""
  
    // Get date ranges
    const today = new Date()
    today.setHours(0, 0, 0, 0)
  
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
    const oneWeekFromNow = new Date(today)
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
  
    // Filter events for each section
    const pastEvents = events.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate < today && eventDate >= oneWeekAgo
    })
  
    const currentEvents = events.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === selectedDate.toDateString()
    })
  
    const upcomingEvents = events.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate > today && eventDate <= oneWeekFromNow
    })
  
    // Render past events
    if (pastEvents.length === 0) {
      const emptyMessage = document.createElement("div")
      emptyMessage.className = "empty-events"
      emptyMessage.textContent = "No events in the past week"
      pastEventsContainer.appendChild(emptyMessage)
    } else {
      pastEvents.forEach((event) => {
        renderEventItem(event, pastEventsContainer, "past")
      })
    }
  
    // Render current events
    if (currentEvents.length === 0) {
      const emptyMessage = document.createElement("div")
      emptyMessage.className = "empty-events"
      emptyMessage.textContent =
        "No events for " + selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      currentEventsContainer.appendChild(emptyMessage)
    } else {
      currentEvents.forEach((event) => {
        renderEventItem(event, currentEventsContainer, "current")
      })
    }
  
    // Render upcoming events
    if (upcomingEvents.length === 0) {
      const emptyMessage = document.createElement("div")
      emptyMessage.className = "empty-events"
      emptyMessage.textContent = "No upcoming events in the next week"
      upcomingEventsContainer.appendChild(emptyMessage)
    } else {
      upcomingEvents.forEach((event) => {
        renderEventItem(event, upcomingEventsContainer, "upcoming")
      })
    }
  
    // Update current date display if selected date is different from today
    const currentDateElement = document.getElementById("currentDate")
    if (selectedDate.toDateString() !== today.toDateString()) {
      currentDateElement.textContent = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(selectedDate)
    } else {
      currentDateElement.textContent = "Today"
    }
  }
  
  // Render a single event item
  function renderEventItem(event, container, type) {
    const eventItem = document.createElement("div")
    eventItem.className = "event-item"
    eventItem.dataset.id = event.id
  
    const eventDetails = document.createElement("div")
    eventDetails.className = "event-details"
  
    const eventTitle = document.createElement("h4")
    eventTitle.textContent = event.title
    eventDetails.appendChild(eventTitle)
  
    const eventDate = document.createElement("p")
    eventDate.textContent = new Date(event.start).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    eventDetails.appendChild(eventDate)
  
    const deleteBtn = document.createElement("button")
    deleteBtn.className = "delete-btn"
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'
    deleteBtn.addEventListener("click", () => {
      deleteEvent(event.id)
    })
  
    eventItem.appendChild(eventDetails)
    eventItem.appendChild(deleteBtn)
    container.appendChild(eventItem)
  }
  
  // Goal Tracker Component
  function initGoalTracker() {
    const goalTitle = document.getElementById("goalTitle")
    const goalTarget = document.getElementById("goalTarget")
    const progressFill = document.getElementById("progressFill")
    const progressPercentage = document.getElementById("progressPercentage")
    const daysRemaining = document.getElementById("daysRemaining")
    const setGoalBtn = document.getElementById("setGoalBtn")
    const achievedBtn = document.getElementById("achievedBtn")
  
    // Initial goal data
    let goal = {
      title: "Complete Final Project",
      timeframe: 30,
      timeframeUnit: "days",
      startDate: new Date(),
      targetDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      progress: 40,
    }
  
    // Calculate progress based on elapsed time
    function calculateProgress() {
      const today = new Date()
      const totalDays = Math.round((goal.targetDate - goal.startDate) / (1000 * 60 * 60 * 24))
      const daysElapsed = Math.round((today - goal.startDate) / (1000 * 60 * 60 * 24))
      return Math.min(Math.round((daysElapsed / totalDays) * 100), 100)
    }
  
    // Update the UI
    function updateGoalUI() {
      goalTitle.textContent = goal.title
      goalTarget.textContent = `Target: ${goal.targetDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
  
      const progress = calculateProgress()
      progressFill.style.width = `${progress}%`
      progressPercentage.textContent = `${progress}%`
  
      const today = new Date()
      const daysLeft = Math.round((goal.targetDate - today) / (1000 * 60 * 60 * 24))
      daysRemaining.textContent = `${daysLeft} days remaining`
    }
  
    // Initial UI update
    updateGoalUI()
  
    // Event listeners
    achievedBtn.addEventListener("click", () => {
      goal.progress = 100
      progressFill.style.width = "100%"
      progressPercentage.textContent = "100%"
    })
  
    // Set Goal button is handled in the modal section
    setGoalBtn.addEventListener("click", () => {
      document.getElementById("goalTitleInput").value = ""
      document.getElementById("timeframeInput").value = "30"
      document.getElementById("timeframeUnit").value = "days"
      document.getElementById("goalModal").classList.add("active")
    })
  
    // Save Goal button
    document.getElementById("saveGoalBtn").addEventListener("click", () => {
      const title = document.getElementById("goalTitleInput").value.trim()
      const timeframe = Number.parseInt(document.getElementById("timeframeInput").value)
      const timeframeUnit = document.getElementById("timeframeUnit").value
  
      if (title === "" || isNaN(timeframe) || timeframe <= 0) return
  
      const startDate = new Date()
      const targetDate = new Date()
  
      if (timeframeUnit === "days") {
        targetDate.setDate(targetDate.getDate() + timeframe)
      } else if (timeframeUnit === "months") {
        targetDate.setMonth(targetDate.getMonth() + timeframe)
      } else if (timeframeUnit === "years") {
        targetDate.setFullYear(targetDate.getFullYear() + timeframe)
      }
  
      goal = {
        title: title,
        timeframe: timeframe,
        timeframeUnit: timeframeUnit,
        startDate: startDate,
        targetDate: targetDate,
        progress: 0,
      }
  
      updateGoalUI()
      document.getElementById("goalModal").classList.remove("active")
    })
  }
  
  // Study Timer Component
  function initStudyTimer() {
    const timerDisplay = document.getElementById("timerDisplay")
    const startPauseBtn = document.getElementById("startPauseBtn")
    const resetBtn = document.getElementById("resetBtn")
    const timerTabs = document.querySelectorAll(".timer-tab")
  
    let timerSettings = {
      studyTime: 25,
      breakTime: 5,
    }
  
    let time = timerSettings.studyTime * 60 // in seconds
    let isRunning = false
    let timerInterval
    let activeTab = "study"
  
    // Format time as MM:SS
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
  
    // Update the timer display
    function updateTimerDisplay() {
      timerDisplay.textContent = formatTime(time)
    }
  
    // Start or pause the timer
    function toggleTimer() {
      if (isRunning) {
        clearInterval(timerInterval)
        startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start'
        startPauseBtn.classList.remove("destructive-btn")
      } else {
        timerInterval = setInterval(() => {
          if (time <= 0) {
            clearInterval(timerInterval)
            isRunning = false
            startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start'
            startPauseBtn.classList.remove("destructive-btn")
            // Alert when timer is done
            alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} time is up!`)
            return
          }
          time--
          updateTimerDisplay()
        }, 1000)
        startPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause'
        startPauseBtn.classList.add("destructive-btn")
      }
      isRunning = !isRunning
    }
  
    // Reset the timer
    function resetTimer() {
      clearInterval(timerInterval)
      time = activeTab === "study" ? timerSettings.studyTime * 60 : timerSettings.breakTime * 60
      updateTimerDisplay()
      isRunning = false
      startPauseBtn.innerHTML = '<i class="fas fa-play"></i> Start'
      startPauseBtn.classList.remove("destructive-btn")
    }
  
    // Switch between study and break tabs
    function switchTab(tab) {
      activeTab = tab
      timerTabs.forEach((t) => {
        t.classList.remove("active")
        if (t.dataset.tab === tab) {
          t.classList.add("active")
        }
      })
      resetTimer()
    }
  
    // Initial display
    updateTimerDisplay()
  
    // Event listeners
    startPauseBtn.addEventListener("click", toggleTimer)
    resetBtn.addEventListener("click", resetTimer)
  
    timerTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        switchTab(tab.dataset.tab)
      })
    })
  
    // Settings button
    document.getElementById("settingsBtn").addEventListener("click", () => {
      document.getElementById("studyTimeInput").value = timerSettings.studyTime
      document.getElementById("studyTimeValue").textContent = timerSettings.studyTime
      document.getElementById("breakTimeInput").value = timerSettings.breakTime
      document.getElementById("breakTimeValue").textContent = timerSettings.breakTime
      document.getElementById("timerModal").classList.add("active")
    })
  
    // Save timer settings
    document.getElementById("saveTimerBtn").addEventListener("click", () => {
      const studyTime = Number.parseInt(document.getElementById("studyTimeInput").value)
      const breakTime = Number.parseInt(document.getElementById("breakTimeInput").value)
  
      timerSettings = {
        studyTime: studyTime,
        breakTime: breakTime,
      }
  
      time = activeTab === "study" ? timerSettings.studyTime * 60 : timerSettings.breakTime * 60
      updateTimerDisplay()
      document.getElementById("timerModal").classList.remove("active")
    })
  
    // Update slider values
    document.getElementById("studyTimeInput").addEventListener("input", function () {
      document.getElementById("studyTimeValue").textContent = this.value
    })
  
    document.getElementById("breakTimeInput").addEventListener("input", function () {
      document.getElementById("breakTimeValue").textContent = this.value
    })
  }
  
  // Todo List Component
  function initTodoList() {
    const todoList = document.getElementById("todoList")
    const newTodoInput = document.getElementById("newTodoInput")
    const addTodoBtn = document.getElementById("addTodoBtn")
  
    // Render the todo list
    function renderTodoList() {
      todoList.innerHTML = ""
  
      todos.forEach((todo) => {
        const todoItem = document.createElement("li")
        todoItem.className = "todo-item"
        todoItem.dataset.id = todo.id
  
        const checkbox = document.createElement("i")
        checkbox.className = `todo-checkbox ${todo.completed ? "checked fas fa-check-circle" : "far fa-circle"}`
        checkbox.addEventListener("click", () => toggleTodo(todo.id))
  
        const todoText = document.createElement("span")
        todoText.className = `todo-text ${todo.completed ? "completed" : ""}`
        todoText.textContent = todo.text
  
        const deleteBtn = document.createElement("button")
        deleteBtn.className = "todo-delete"
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id))
  
        todoItem.appendChild(checkbox)
        todoItem.appendChild(todoText)
        todoItem.appendChild(deleteBtn)
        todoList.appendChild(todoItem)
      })
    }
  
    // Add a new todo
    function addTodo() {
      const text = newTodoInput.value.trim()
      if (text === "") return
  
      const newTodo = {
        id: Date.now().toString(),
        text: text,
        completed: false,
      }
  
      todos.push(newTodo)
      newTodoInput.value = ""
      renderTodoList()
  
      // Save to database (in a real app)
      // saveTodoToDatabase(newTodo);
    }
  
    // Toggle todo completion
    function toggleTodo(id) {
      const todo = todos.find((t) => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
        renderTodoList()
  
        // Update in database (in a real app)
        // updateTodoInDatabase(todo);
      }
    }
  
    // Delete a todo
    function deleteTodo(id) {
      const index = todos.findIndex((t) => t.id === id)
      if (index !== -1) {
        todos.splice(index, 1)
        renderTodoList()
  
        // Delete from database (in a real app)
        // deleteTodoFromDatabase(id);
      }
    }
  
    // Initial render
    renderTodoList()
  
    // Event listeners
    addTodoBtn.addEventListener("click", addTodo)
    newTodoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addTodo()
      }
    })
  }
  
  // Event Functions
  function openAddEventModal(dateStr) {
    selectedEvent = null
    const modal = document.getElementById("eventModal")
    const modalTitle = document.getElementById("eventModalTitle")
    const eventId = document.getElementById("eventId")
    const eventTitle = document.getElementById("eventTitle")
    const eventDate = document.getElementById("eventDate")
    const deleteBtn = document.getElementById("deleteEventBtn")
  
    modalTitle.textContent = "Add New Event"
    eventId.value = ""
    eventTitle.value = ""
    eventDate.value = dateStr
    deleteBtn.style.display = "none"
  
    modal.classList.add("active")
  }
  
  function openEditEventModal(event) {
    selectedEvent = event
    const modal = document.getElementById("eventModal")
    const modalTitle = document.getElementById("eventModalTitle")
    const eventId = document.getElementById("eventId")
    const eventTitle = document.getElementById("eventTitle")
    const eventDate = document.getElementById("eventDate")
    const deleteBtn = document.getElementById("deleteEventBtn")
  
    modalTitle.textContent = "Edit Event"
    eventId.value = event.id
    eventTitle.value = event.title
    eventDate.value = event.startStr
    deleteBtn.style.display = "block"
  
    modal.classList.add("active")
  }
  
  function saveEvent() {
    const eventId = document.getElementById("eventId").value
    const eventTitle = document.getElementById("eventTitle").value.trim()
    const eventDate = document.getElementById("eventDate").value
  
    if (eventTitle === "" || eventDate === "") return
  
    if (eventId) {
      // Update existing event
      const index = events.findIndex((e) => e.id === eventId)
      if (index !== -1) {
        events[index] = {
          id: eventId,
          title: eventTitle,
          start: eventDate,
        }
      }
    } else {
      // Add new event
      const newEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventDate,
      }
      events.push(newEvent)
    }
  
    // Update calendar and events
    refreshCalendar()
    renderEvents()
  
    // Close modal
    document.getElementById("eventModal").classList.remove("active")
  }
  
  function deleteEvent(id) {
    const index = events.findIndex((e) => e.id === id)
    if (index !== -1) {
      events.splice(index, 1)
  
      // Update calendar and events
      refreshCalendar()
      renderEvents()
  
      // Close modal if open
      document.getElementById("eventModal").classList.remove("active")
    }
  }
  
  function refreshCalendar() {
    calendar.removeAllEvents()
    calendar.addEventSource(getFormattedEvents())
  }
  
  // Modal Handling
  function initModals() {
    // Close buttons
    const closeButtons = document.querySelectorAll(".close-btn")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("eventModal").classList.remove("active")
        document.getElementById("goalModal").classList.remove("active")
        document.getElementById("timerModal").classList.remove("active")
      })
    })
  
    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        e.target.classList.remove("active")
      }
    })
  
    // Add Event button
    document.getElementById("addEventBtn").addEventListener("click", () => {
      openAddEventModal(new Date().toISOString().split("T")[0])
    })
  
    // Save Event button
    document.getElementById("saveEventBtn").addEventListener("click", saveEvent)
  
    // Delete Event button
    document.getElementById("deleteEventBtn").addEventListener("click", () => {
      if (selectedEvent) {
        deleteEvent(selectedEvent.id)
      }
    })
  }
  
  // PHP Database Functions (these would connect to your PHP backend)
  function saveEventToDatabase(event) {
    // In a real app, this would use fetch or XMLHttpRequest to send data to PHP
    console.log("Saving event to database:", event)
  }
  
  function updateEventInDatabase(event) {
    console.log("Updating event in database:", event)
  }
  
  function deleteEventFromDatabase(id) {
    console.log("Deleting event from database:", id)
  }
  
  function saveTodoToDatabase(todo) {
    console.log("Saving todo to database:", todo)
  }
  
  function updateTodoInDatabase(todo) {
    console.log("Updating todo in database:", todo)
  }
  
  function deleteTodoFromDatabase(id) {
    console.log("Deleting todo from database:", id)
  }
  
  function saveGoalToDatabase(goal) {
    console.log("Saving goal to database:", goal)
  }
  
  