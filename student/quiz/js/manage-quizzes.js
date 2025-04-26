document.addEventListener("DOMContentLoaded", () => {
  const quizTable = document.getElementById("quizTable")
  const statusMessage = document.getElementById("statusMessage")
  const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"))
  const resultsHistoryModal = new bootstrap.Modal(document.getElementById("resultsHistoryModal"))
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")
  const resultsQuizTitle = document.getElementById("resultsQuizTitle")
  const resultsTable = document.getElementById("resultsTable")

  let quizToDelete = null

  // Load quizzes
  loadQuizzes()

  function loadQuizzes() {
    fetch("api/get_quizzes.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          displayQuizzes(data.quizzes)
        } else {
          showStatusMessage("Error loading quizzes: " + data.message, "danger")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showStatusMessage("Error loading quizzes. Please try again.", "danger")
      })
  }

  function displayQuizzes(quizzes) {
    if (quizzes.length === 0) {
      quizTable.innerHTML =
        '<tr><td colspan="6" class="text-center">No quizzes found. <a href="index.php">Create a new quiz</a>.</td></tr>'
      return
    }

    quizTable.innerHTML = ""

    quizzes.forEach((quiz) => {
      // Format dates
      const createdDate = new Date(quiz.created_at).toLocaleString()
      const updatedDate = new Date(quiz.updated_at).toLocaleString()

      // Get question count
      fetch(`api/get_quiz.php?id=${quiz.quiz_id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const questionCount = data.quiz.questions.length

            const row = document.createElement("tr")
            row.innerHTML = `
                            <td>${quiz.title}</td>
                            <td>${quiz.description.substring(0, 50)}${quiz.description.length > 50 ? "..." : ""}</td>
                            <td>${createdDate}</td>
                            <td>${updatedDate}</td>
                            <td>${questionCount}</td>
                            <td>
                                <div class="btn-group">
                                    <a href="quiz.php?id=${quiz.quiz_id}" class="btn btn-sm btn-primary">Take</a>
                                    <a href="index.php?id=${quiz.quiz_id}" class="btn btn-sm btn-secondary">Edit</a>
                                    <button class="btn btn-sm btn-info view-results" data-quiz-id="${quiz.quiz_id}" data-quiz-title="${quiz.title}">Results</button>
                                    <button class="btn btn-sm btn-danger delete-quiz" data-quiz-id="${quiz.quiz_id}">Delete</button>
                                </div>
                            </td>
                        `

            quizTable.appendChild(row)

            // Add delete event listener
            row.querySelector(".delete-quiz").addEventListener("click", function () {
              quizToDelete = this.getAttribute("data-quiz-id")
              deleteModal.show()
            })

            // Add view results event listener
            row.querySelector(".view-results").addEventListener("click", function () {
              const quizId = this.getAttribute("data-quiz-id")
              const quizTitle = this.getAttribute("data-quiz-title")
              viewQuizResults(quizId, quizTitle)
            })
          }
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    })
  }

  // Confirm delete button
  confirmDeleteBtn.addEventListener("click", () => {
    if (quizToDelete) {
      deleteQuiz(quizToDelete)
      deleteModal.hide()
    }
  })

  function deleteQuiz(quizId) {
    fetch(`api/delete_quiz.php?id=${quizId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showStatusMessage("Quiz deleted successfully.", "success")
          loadQuizzes()
        } else {
          showStatusMessage("Error deleting quiz: " + data.message, "danger")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showStatusMessage("Error deleting quiz. Please try again.", "danger")
      })
  }

  function viewQuizResults(quizId, quizTitle) {
    // Set quiz title in modal
    resultsQuizTitle.textContent = quizTitle

    // Load results
    fetch(`api/get_quiz_results.php?id=${quizId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          displayQuizResults(data.results)
        } else {
          resultsTable.innerHTML = '<tr><td colspan="3" class="text-center">Error loading results.</td></tr>'
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        resultsTable.innerHTML = '<tr><td colspan="3" class="text-center">Error loading results.</td></tr>'
      })

    // Show modal
    resultsHistoryModal.show()
  }

  function displayQuizResults(results) {
    if (results.length === 0) {
      resultsTable.innerHTML = '<tr><td colspan="3" class="text-center">No results found for this quiz.</td></tr>'
      return
    }

    resultsTable.innerHTML = ""

    results.forEach((result) => {
      const date = new Date(result.completed_at).toLocaleString()
      const percentage = Math.round((result.score / result.total_questions) * 100)

      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${date}</td>
                <td>${result.score}/${result.total_questions}</td>
                <td>${percentage}%</td>
            `

      resultsTable.appendChild(row)
    })
  }

  function showStatusMessage(message, type) {
    statusMessage.textContent = message
    statusMessage.className = `alert alert-${type}`
    statusMessage.classList.remove("d-none")

    // Hide message after 5 seconds
    setTimeout(() => {
      statusMessage.classList.add("d-none")
    }, 5000)
  }
})
