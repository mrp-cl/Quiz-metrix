document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const createQuizBtn = document.getElementById("createQuizBtn")
  const clearFormBtn = document.getElementById("clearFormBtn")
  const addCardBtn = document.getElementById("addCardBtn")
  const questionCards = document.getElementById("questionCards")
  const timedQuizSwitch = document.getElementById("timedQuizSwitch")
  const timerSettings = document.getElementById("timerSettings")
  const startQuizBtn = document.getElementById("startQuizBtn")
  const confirmStartQuizBtn = document.getElementById("confirmStartQuizBtn")
  const confirmSaveQuizBtn = document.getElementById("confirmSaveQuizBtn")
  const answerTypeCheckboxes = document.querySelectorAll(".answer-type-checkbox")
  const answerTypeWarning = document.getElementById("answerTypeWarning")
  const successAlert = document.getElementById("successAlert")
  const errorAlert = document.getElementById("errorAlert")
  const recentQuizzes = document.getElementById("recentQuizzes")

  // Quiz data
  let quizData = {
    title: "",
    description: "",
    questions: [],
    settings: {
      timed: false,
      time: 5,
      answerTypes: [""], // Default to multiple choice
    },
  }

  // Drag and drop variables
  let draggedCard = null

  // Check if we're editing an existing quiz
  const urlParams = new URLSearchParams(window.location.search)
  const quizId = urlParams.get("id")

  let quizSaveModal // Declare quizSaveModal here
  let quizSettingsModal // Declare quizSettingsModal here

  if (quizId) {
    // Load quiz for editing
    loadQuiz(quizId)
  } else {
    // Add default question cards
    for (let i = 0; i < 5; i++) {
      addNewCard()
    }
  }

  // Initialize event listeners
  initEventListeners()

  // Load recent quizzes
  loadRecentQuizzes()

  function initEventListeners() {
    // Add new card button
    addCardBtn.addEventListener("click", addNewCard)

    // Clear form button
    clearFormBtn.addEventListener("click", clearForm)

    // Timed quiz switch
    timedQuizSwitch.addEventListener("change", function () {
      if (this.checked) {
        timerSettings.classList.remove("d-none")
        quizData.settings.timed = true
      } else {
        timerSettings.classList.add("d-none")
        quizData.settings.timed = false
      }
    })


   

    // Create quiz button
    createQuizBtn.addEventListener("click", () => {
      // First save the quiz
      saveQuiz(true)
    })

    // Confirm save quiz button in modal
    confirmSaveQuizBtn.addEventListener("click", () => {
      // Check if at least one answer type is selected
      const selectedTypes = getSelectedAnswerTypes()
      if (selectedTypes.length === 0) {
        answerTypeWarning.classList.remove("d-none")
        return
      }
    })
    
    // Start quiz button
    startQuizBtn.addEventListener("click", () => {
      // First save the quiz
      saveQuiz(true)
    })  

    // Confirm start quiz button in modal
    confirmStartQuizBtn.addEventListener("click", () => {
      // Check if at least one answer type is selected
      const selectedTypes = getSelectedAnswerTypes()
      if (selectedTypes.length === 0) {
        answerTypeWarning.classList.remove("d-none")
        return
      }

      startQuiz()
    })

    // Answer type checkboxes
    answerTypeCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        // Hide warning if at least one checkbox is checked
        if (getSelectedAnswerTypes().length > 0) {
          answerTypeWarning.classList.add("d-none")
        }
      })
    })
  }

  function getSelectedAnswerTypes() {
    const selectedTypes = []
    answerTypeCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedTypes.push(checkbox.value)
      }
    })
    return selectedTypes
  }

  function addNewCard() {
    const cardCount = document.querySelectorAll(".question-card").length
    const newCardId = cardCount + 1

    const newCard = document.createElement("div")
    newCard.className = "card question-card mb-3"
    newCard.setAttribute("data-card-id", newCardId)
    newCard.setAttribute("draggable", "true")

    newCard.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <span class="card-number">${newCardId}</span>
                <div>
                    <button class="btn btn-sm btn-light move-card-btn" title="Drag to reorder"><i class="bi bi-grip-vertical"></i></button>
                    <button class="btn btn-sm btn-light delete-card-btn"><i class="bi bi-trash"></i></button>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3 mb-md-0">
                        <label class="form-label">Answer (Term)</label>
                        <input type="text" class="form-control term-input" placeholder="Enter the answer">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Question (Description)</label>
                        <input type="text" class="form-control description-input" placeholder="Enter the question">
                    </div>
                </div>
            </div>
        `

    questionCards.appendChild(newCard)
    addCardEventListeners(newCard)
    initCardDragAndDrop(newCard)

    updateCardNumbers()
  }

  function addCardEventListeners(card) {
    // Delete card button
    card.querySelector(".delete-card-btn").addEventListener("click", () => {
      card.remove()
      updateCardNumbers()
    })
  }

  function initCardDragAndDrop(card) {
    // Drag start event
    card.addEventListener("dragstart", function (e) {
      draggedCard = this
      setTimeout(() => {
        this.classList.add("dragging")
      }, 0)
    })

    // Drag end event
    card.addEventListener("dragend", function () {
      this.classList.remove("dragging")
      draggedCard = null
      updateCardNumbers()
    })

    // Drag over event
    card.addEventListener("dragover", function (e) {
      e.preventDefault()
      if (draggedCard !== this) {
        this.classList.add("drag-over")
      }
    })

    // Drag leave event
    card.addEventListener("dragleave", function () {
      this.classList.remove("drag-over")
    })

    // Drop event
    card.addEventListener("drop", function (e) {
      e.preventDefault()
      this.classList.remove("drag-over")

      if (draggedCard !== this) {
        const allCards = Array.from(document.querySelectorAll(".question-card"))
        const draggedIndex = allCards.indexOf(draggedCard)
        const targetIndex = allCards.indexOf(this)

        if (draggedIndex < targetIndex) {
          this.parentNode.insertBefore(draggedCard, this.nextSibling)
        } else {
          this.parentNode.insertBefore(draggedCard, this)
        }
      }
    })

    // Make the move button trigger dragging
    const moveBtn = card.querySelector(".move-card-btn")
    moveBtn.addEventListener("mousedown", (e) => {
      // Prevent default to avoid button focus
      e.preventDefault()

      // Trigger the drag on the parent card
      const event = new MouseEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
      card.dispatchEvent(event)
    })
  }

  function updateCardNumbers() {
    const cards = document.querySelectorAll(".question-card")
    cards.forEach((card, index) => {
      card.setAttribute("data-card-id", index + 1)
      card.querySelector(".card-number").textContent = index + 1
    })
  }





  function createQuiz(showSettingsModal = false) {
    // Get quiz title and description
    quizData.title = document.getElementById("quizTitle").value || "Untitled Quiz"
    quizData.description = document.getElementById("quizDescription").value || "No description provided"

    // Get questions
    quizData.questions = []
    document.querySelectorAll(".question-card").forEach((card) => {
      const term = card.querySelector(".term-input").value
      const description = card.querySelector(".description-input").value

      if (term || description) {
        quizData.questions.push({
          term: term || "No answer provided",
          description: description || "No question provided",
        })
      }
    })

    // Check if we have at least one question
    if (quizData.questions.length <= 3) {
      showError("Please add at least two question to your quiz.")
      return
    }

    // If editing, include the quiz ID
    if (quizId) {
      quizData.quiz_id = quizId
    }

    // Save to database
    fetch("api/save_quiz.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update quiz ID in case it's a new quiz
          quizData.quiz_id = data.quiz_id

          if (showSettingsModal) {
            // Show the quiz settings modal
            quizSaveModal = new bootstrap.Modal(document.getElementById("quizSaveModal"))
            quizSaveModal.show()
          } else {
            showSuccess("Quiz saved successfully!")
            // Reload recent quizzes
            loadRecentQuizzes()
          }
        } else {
          showError("Error saving quiz: " + data.message)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showError("Error saving quiz. Please try again.")
      })
  }



  function saveQuiz(showSettingsModal = false) {
    // Get quiz title and description
    quizData.title = document.getElementById("quizTitle").value || "Untitled Quiz"
    quizData.description = document.getElementById("quizDescription").value || "No description provided"

    // Get questions
    quizData.questions = []
    document.querySelectorAll(".question-card").forEach((card) => {
      const term = card.querySelector(".term-input").value
      const description = card.querySelector(".description-input").value

      if (term || description) {
        quizData.questions.push({
          term: term || "No answer provided",
          description: description || "No question provided",
        })
      }
    })

    // Check if we have at least one question
    if (quizData.questions.length <= 3) {
      showError("Please add at least two question to your quiz.")
      return
    }

    // If editing, include the quiz ID
    if (quizId) {
      quizData.quiz_id = quizId
    }

    // Save to database
    fetch("api/save_quiz.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update quiz ID in case it's a new quiz
          quizData.quiz_id = data.quiz_id

          if (showSettingsModal) {
            // Show the quiz settings modal
            quizSettingsModal = new bootstrap.Modal(document.getElementById("quizSettingsModal"))
            quizSettingsModal.show()
          } else {
            showSuccess("Quiz saved successfully!")
            // Reload recent quizzes
            loadRecentQuizzes()
          }
        } else {
          showError("Error saving quiz: " + data.message)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showError("Error saving quiz. Please try again.")
      })
  }

  function startQuiz() {
    // Get final settings
    quizData.settings.time = Number.parseInt(document.getElementById("quizTime").value) || 5
    quizData.settings.answerTypes = getSelectedAnswerTypes()

    // Assign random answer types to each question
    quizData.questions.forEach((question) => {
      // Randomly select one of the chosen answer types for this question
      const randomIndex = Math.floor(Math.random() * quizData.settings.answerTypes.length)
      question.answerType = quizData.settings.answerTypes[randomIndex]
    })

    // Update quiz with settings
    fetch("api/save_quiz.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Redirect to quiz page
          window.location.href = "quiz.php?id=" + data.quiz_id
        } else {
          showError("Error starting quiz: " + data.message)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showError("Error starting quiz. Please try again.")
      })
  }

  function loadQuiz(quizId) {
    fetch(`api/get_quiz.php?id=${quizId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          populateQuizForm(data.quiz)
        } else {
          showError("Error loading quiz: " + data.message)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showError("Error loading quiz. Please try again.")
      })
  }

  function populateQuizForm(quiz) {
    // Set quiz title and description
    document.getElementById("quizTitle").value = quiz.title
    document.getElementById("quizDescription").value = quiz.description

    // Clear existing question cards
    questionCards.innerHTML = ""

    // Add question cards for each question
    quiz.questions.forEach((question, index) => {
      const newCard = document.createElement("div")
      newCard.className = "card question-card mb-3"
      newCard.setAttribute("data-card-id", index + 1)
      newCard.setAttribute("draggable", "true")

      newCard.innerHTML = `
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span class="card-number">${index + 1}</span>
                    <div>
                        <button class="btn btn-sm btn-light move-card-btn" title="Drag to reorder"><i class="bi bi-grip-vertical"></i></button>
                        <button class="btn btn-sm btn-light delete-card-btn"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3 mb-md-0">
                            <label class="form-label">Answer (Term)</label>
                            <input type="text" class="form-control term-input" placeholder="Enter the answer" value="${question.term}">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Question (Description)</label>
                            <input type="text" class="form-control description-input" placeholder="Enter the question" value="${question.description}">
                        </div>
                    </div>
                </div>
            `

      questionCards.appendChild(newCard)
      addCardEventListeners(newCard)
      initCardDragAndDrop(newCard)
    })

    // If no questions were loaded, add default cards
    if (quiz.questions.length === 0) {
      for (let i = 0; i < 5; i++) {
        addNewCard()
      }
    }

    // Set quiz settings
    if (quiz.settings) {
      document.getElementById("timedQuizSwitch").checked = quiz.settings.timed
      if (quiz.settings.timed) {
        timerSettings.classList.remove("d-none")
        document.getElementById("quizTime").value = quiz.settings.time
      }

      // Set answer types
      answerTypeCheckboxes.forEach((checkbox) => {
        checkbox.checked = quiz.settings.answerTypes.includes(checkbox.value)
      })
    }

    // Store the quiz data
    quizData = quiz
  }

  function loadRecentQuizzes() {
    fetch("api/get_quizzes.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          displayRecentQuizzes(data.quizzes)
        } else {
          console.error("Error fetching quizzes:", data.message)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  function displayRecentQuizzes(quizzes) {
    recentQuizzes.innerHTML = ""

    if (quizzes.length === 0) {
      recentQuizzes.innerHTML = '<div class="col-12"><p class="text-center">No saved quizzes found.</p></div>'
      return
    }

    // Display up to 4 most recent quizzes
    const recentQuizzesData = quizzes.slice(0, 4)

    recentQuizzesData.forEach((quiz) => {
      const date = new Date(quiz.updated_at)
      const formattedDate = date.toLocaleDateString()

      const quizCard = document.createElement("div")
      quizCard.className = "col-md-3 col-sm-6 mb-3"
      quizCard.innerHTML = `
                <div class="recent-quiz-card" data-quiz-id="${quiz.quiz_id}">
                    <div class="label-user">Quiz — ${formattedDate}</div>
                    <div class="title">${quiz.title}</div>
                    <div class="date">${quiz.description.substring(0, 30)}${quiz.description.length > 30 ? "..." : ""}</div>
                </div>
            `

      recentQuizzes.appendChild(quizCard)

      // Add click event to load the quiz
      quizCard.querySelector(".recent-quiz-card").addEventListener("click", function () {
        const quizId = this.getAttribute("data-quiz-id")
        window.location.href = `index.php?id=${quizId}`
      })
    })
  }

  function clearForm() {
    document.getElementById("quizTitle").value = ""
    document.getElementById("quizDescription").value = ""

    // Clear question cards
    questionCards.innerHTML = ""

    // Add default question cards
    for (let i = 0; i < 5; i++) {
      addNewCard()
    }

    // Reset quiz data
    quizData = {
      title: "",
      description: "",
      questions: [],
      settings: {
        timed: false,
        time: 5,
        answerTypes: ["multiple"],
      },
    }

    // Reset settings
    document.getElementById("timedQuizSwitch").checked = false
    timerSettings.classList.add("d-none")
    document.getElementById("quizTime").value = 5

    // Reset answer types
    answerTypeCheckboxes.forEach((checkbox) => {
      checkbox.checked = checkbox.value === "multiple"
    })

    showSuccess("Form cleared successfully.")
  }

  function showSuccess(message) {
    successAlert.textContent = message
    successAlert.classList.remove("d-none")
    errorAlert.classList.add("d-none")

    // Hide after 3 seconds
    setTimeout(() => {
      successAlert.classList.add("d-none")
    }, 3000)
  }

  function showError(message) {
    errorAlert.textContent = message
    errorAlert.classList.remove("d-none")
    successAlert.classList.add("d-none")

    // Hide after 5 seconds
    setTimeout(() => {
      errorAlert.classList.add("d-none")
    }, 5000)
  }
})