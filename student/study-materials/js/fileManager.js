document.addEventListener("DOMContentLoaded", () => {
    // Initialize variables
    const fileContainer = document.querySelector(".file-container")
    const listView = document.querySelector(".list-view")
    const viewToggles = document.querySelectorAll(".view-toggle")
    const uploadForm = document.getElementById("uploadForm")
    const uploadButton = document.getElementById("uploadButton")
    const uploadProgress = document.getElementById("uploadProgress")
    const progressBar = uploadProgress ? uploadProgress.querySelector(".progress-bar") : null
    const newFolderForm = document.getElementById("newFolderForm")
    const createFolderButton = document.getElementById("createFolderButton")
    const renameFolderForm = document.getElementById("renameFolderForm")
    const renameFolderButton = document.getElementById("renameFolderButton")
    const confirmActionButton = document.getElementById("confirmActionButton")
    const searchForm = document.getElementById("searchForm")
  
    // Initialize Bootstrap modals
    const uploadModal = document.getElementById("uploadModal")
      ? new bootstrap.Modal(document.getElementById("uploadModal"))
      : null
    const newFolderModal = document.getElementById("newFolderModal")
      ? new bootstrap.Modal(document.getElementById("newFolderModal"))
      : null
    const renameFolderModal = document.getElementById("renameFolderModal")
      ? new bootstrap.Modal(document.getElementById("renameFolderModal"))
      : null
    const previewModal = document.getElementById("previewModal")
      ? new bootstrap.Modal(document.getElementById("previewModal"))
      : null
    const confirmationModal = document.getElementById("confirmationModal")
      ? new bootstrap.Modal(document.getElementById("confirmationModal"))
      : null
  
    // Initialize SortableJS for drag and drop
    const folderContainers = document.querySelectorAll(".folders-container")
    const fileContainers = document.querySelectorAll(".files-container")
  
    if (typeof Sortable !== "undefined") {
      folderContainers.forEach((container) => {
        if (container) {
          new Sortable(container, {
            animation: 150,
            ghostClass: "sortable-ghost",
            chosenClass: "sortable-chosen",
            onEnd: (evt) => {
              updatePositions(
                "folder",
                Array.from(container.querySelectorAll(".folder-card")).map((card) => ({
                  id: card.getAttribute("data-id"),
                  position: Array.from(container.children).indexOf(card.closest(".col")),
                })),
              )
            },
          })
        }
      })
  
      fileContainers.forEach((container) => {
        if (container) {
          new Sortable(container, {
            animation: 150,
            ghostClass: "sortable-ghost",
            chosenClass: "sortable-chosen",
            onEnd: (evt) => {
              updatePositions(
                "file",
                Array.from(container.querySelectorAll(".file-card")).map((card) => ({
                  id: card.getAttribute("data-id"),
                  position: Array.from(container.children).indexOf(card.closest(".col")),
                })),
              )
            },
          })
        }
      })
    }
  
    // View toggle (Grid/List)
    viewToggles.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        const view = this.getAttribute("data-view")
        console.log("Switching to view:", view)
  
        // Remove active class from all toggles
        viewToggles.forEach((t) => t.classList.remove("active"))
  
        // Add active class to clicked toggle
        this.classList.add("active")
  
        // Get the containers again to ensure we have the latest references
        const gridView = document.querySelector(".grid-view")
        const listView = document.querySelector(".list-view")
  
        console.log("Grid view element:", gridView)
        console.log("List view element:", listView)
  
        if (view === "grid") {
          if (gridView) {
            gridView.classList.remove("d-none")
            console.log("Showing grid view")
          }
          if (listView) {
            listView.classList.add("d-none")
            console.log("Hiding list view")
          }
        } else if (view === "list") {
          if (gridView) {
            gridView.classList.add("d-none")
            console.log("Hiding grid view")
          }
          if (listView) {
            listView.classList.remove("d-none")
            console.log("Showing list view")
          }
        }
  
        // Save preference
        localStorage.setItem("preferredView", view)
      })
    })
  
    // Load saved view preference
    const savedView = localStorage.getItem("preferredView")
    if (savedView) {
      const viewToggle = document.querySelector(`.view-toggle[data-view="${savedView}"]`)
      if (viewToggle) {
        viewToggle.click()
      }
    }
  
    // Make sure search form submits properly
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        // Form will submit normally, no need to prevent default
        // This is just to ensure the form is working
        console.log("Search form submitted")
      })
    }
  
    // File upload
    if (uploadButton) {
      uploadButton.addEventListener("click", () => {
        const fileInput = document.getElementById("fileUpload")
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
          showToast("Please select a file to upload", "warning")
          return
        }
  
        const file = fileInput.files[0]
  
        if (!file) {
          showToast("Please select a file to upload", "warning")
          return
        }
  
        const formData = new FormData(uploadForm)
  
        // Show progress bar
        if (uploadProgress) {
          uploadProgress.classList.remove("d-none")
        }
  
        // Create AJAX request
        const xhr = new XMLHttpRequest()
  
        // Track upload progress
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && progressBar) {
            const percentComplete = Math.round((e.loaded / e.total) * 100)
            progressBar.style.width = percentComplete + "%"
            progressBar.textContent = percentComplete + "%"
            progressBar.setAttribute("aria-valuenow", percentComplete)
          }
        })
  
        // Handle response
        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText)
  
              if (response.success) {
                showToast("File uploaded successfully", "success")
                // Reload the page to show the new file
                window.location.reload()
              } else {
                showToast(response.message || "Error uploading file", "danger")
              }
            } catch (e) {
              showToast("Error processing server response", "danger")
              console.error("Error parsing JSON:", e)
            }
          } else {
            showToast("Error uploading file", "danger")
            console.error("XHR error:", xhr.status, xhr.statusText)
          }
  
          // Hide progress bar and reset form
          if (uploadProgress) {
            uploadProgress.classList.add("d-none")
          }
          uploadForm.reset()
          if (uploadModal) {
            uploadModal.hide()
          }
        })
  
        // Handle errors
        xhr.addEventListener("error", () => {
          showToast("Error uploading file", "danger")
          console.error("XHR network error")
          if (uploadProgress) {
            uploadProgress.classList.add("d-none")
          }
        })
  
        // Send the request
        xhr.open("POST", "api/upload.php", true)
        xhr.send(formData)
      })
    }
  
    // Create new folder
    if (createFolderButton) {
      createFolderButton.addEventListener("click", () => {
        const folderNameInput = document.getElementById("folderName")
        if (!folderNameInput) {
          showToast("Form error: Folder name input not found", "danger")
          return
        }
  
        const folderName = folderNameInput.value.trim()
  
        if (!folderName) {
          showToast("Please enter a folder name", "warning")
          return
        }
  
        const formData = new FormData(newFolderForm)
  
        fetch("api/create-folder.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
          })
          .then((data) => {
            if (data.success) {
              showToast("Folder created successfully", "success")
              window.location.reload()
            } else {
              showToast(data.message || "Error creating folder", "danger")
            }
          })
          .catch((error) => {
            showToast("Error creating folder", "danger")
            console.error("Error:", error)
          })
          .finally(() => {
            newFolderForm.reset()
            if (newFolderModal) {
              newFolderModal.hide()
            }
          })
      })
    }
  
    // Rename folder
    document.querySelectorAll(".rename-folder").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
  
        const folderId = this.getAttribute("data-id")
        const folderName = this.getAttribute("data-name")
  
        const renameFolderIdInput = document.getElementById("renameFolderId")
        const newFolderNameInput = document.getElementById("newFolderName")
  
        if (renameFolderIdInput && newFolderNameInput) {
          renameFolderIdInput.value = folderId
          newFolderNameInput.value = folderName
        }
  
        if (renameFolderModal) {
          renameFolderModal.show()
        }
      })
    })
  
    if (renameFolderButton) {
      renameFolderButton.addEventListener("click", () => {
        const newFolderNameInput = document.getElementById("newFolderName")
        if (!newFolderNameInput) {
          showToast("Form error: New folder name input not found", "danger")
          return
        }
  
        const folderName = newFolderNameInput.value.trim()
  
        if (!folderName) {
          showToast("Please enter a folder name", "warning")
          return
        }
  
        const formData = new FormData(renameFolderForm)
  
        fetch("api/rename-folder.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
          })
          .then((data) => {
            if (data.success) {
              showToast("Folder renamed successfully", "success")
              window.location.reload()
            } else {
              showToast(data.message || "Error renaming folder", "danger")
            }
          })
          .catch((error) => {
            showToast("Error renaming folder", "danger")
            console.error("Error:", error)
          })
          .finally(() => {
            renameFolderForm.reset()
            if (renameFolderModal) {
              renameFolderModal.hide()
            }
          })
      })
    }
  
    // Delete folder
    document.querySelectorAll(".delete-folder").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
  
        const folderId = this.getAttribute("data-id")
  
        const confirmationMessageEl = document.getElementById("confirmationMessage")
        if (confirmationMessageEl) {
          confirmationMessageEl.textContent =
            "Are you sure you want to delete this folder? All files inside will be moved to the parent folder."
        }
  
        if (confirmActionButton) {
          confirmActionButton.setAttribute("data-action", "delete-folder")
          confirmActionButton.setAttribute("data-id", folderId)
        }
  
        if (confirmationModal) {
          confirmationModal.show()
        }
      })
    })
  
    // Delete file
    document.querySelectorAll(".delete-file").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
  
        const fileId = this.getAttribute("data-id")
  
        const confirmationMessageEl = document.getElementById("confirmationMessage")
        if (confirmationMessageEl) {
          confirmationMessageEl.textContent = "Are you sure you want to delete this file?"
        }
  
        if (confirmActionButton) {
          confirmActionButton.setAttribute("data-action", "delete-file")
          confirmActionButton.setAttribute("data-id", fileId)
        }
  
        if (confirmationModal) {
          confirmationModal.show()
        }
      })
    })
  
    // Confirmation action
    if (confirmActionButton) {
      confirmActionButton.addEventListener("click", function () {
        const action = this.getAttribute("data-action")
        const id = this.getAttribute("data-id")
  
        let url, successMessage
  
        if (action === "delete-folder") {
          url = "api/delete-folder.php"
          successMessage = "Folder deleted successfully"
        } else if (action === "delete-file") {
          url = "api/delete-file.php"
          successMessage = "File deleted successfully"
        } else {
          if (confirmationModal) {
            confirmationModal.hide()
          }
          return
        }
  
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "id=" + id,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
          })
          .then((data) => {
            if (data.success) {
              showToast(successMessage, "success", action === "delete-file" ? id : null)
  
              // Remove the element from the DOM
              if (action === "delete-file") {
                document.querySelectorAll(`[data-id="${id}"][data-type="file"]`).forEach((el) => {
                  el.closest(".col")?.remove()
                  el.closest("tr")?.remove()
                })
              } else {
                window.location.reload()
              }
            } else {
              showToast(data.message || "Error performing action", "danger")
            }
          })
          .catch((error) => {
            showToast("Error performing action", "danger")
            console.error("Error:", error)
          })
          .finally(() => {
            if (confirmationModal) {
              confirmationModal.hide()
            }
          })
      })
    }
  
    // Preview file
    document.querySelectorAll(".preview-file").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
  
        const fileId = this.getAttribute("data-id")
        const fileType = this.getAttribute("data-type")
        const filePath = this.getAttribute("data-path")
  
        // For PDF files, open in a new tab instead of modal
        if (fileType === "pdf") {
          window.open(`uploads/${filePath}`, "_blank")
          return
        }
  
        const previewContent = document.getElementById("previewContent")
        const previewDownloadBtn = document.getElementById("previewDownloadBtn")
  
        if (!previewContent || !previewDownloadBtn) {
          console.error("Preview elements not found")
          return
        }
  
        // Clear previous content
        previewContent.innerHTML = ""
  
        // Set download link
        previewDownloadBtn.href = "api/download.php?id=" + fileId
  
        // Load preview based on file type
        if (fileType === "txt") {
          fetch("api/preview.php?id=" + fileId)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
              }
              return response.text()
            })
            .then((text) => {
              previewContent.innerHTML = `<pre class="p-3">${text}</pre>`
            })
            .catch((error) => {
              previewContent.innerHTML = '<div class="alert alert-danger">Error loading file preview</div>'
              console.error("Error:", error)
            })
        } else if (fileType === "docx") {
          previewContent.innerHTML =
            '<div class="alert alert-info">Preview not available for DOCX files. Please download the file to view it.</div>'
        } else {
          previewContent.innerHTML = '<div class="alert alert-warning">Preview not available for this file type</div>'
        }
  
        if (previewModal) {
          previewModal.show()
        }
      })
    })
  
    // Update positions after drag and drop
    function updatePositions(type, positions) {
      fetch("api/update-positions.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          positions: positions,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          if (!data.success) {
            showToast("Error updating positions", "warning")
          }
        })
        .catch((error) => {
          console.error("Error:", error)
        })
    }
  
    // Show toast notification
    function showToast(message, type, fileId = null) {
      const toastContainer = document.querySelector(".toast-container")
      if (!toastContainer) {
        console.error("Toast container not found")
        return
      }
  
      const toastId = "toast-" + Date.now()
  
      let undoButton = ""
      if (fileId && type === "success" && message.includes("deleted")) {
        undoButton = `<button type="button" class="btn btn-link p-0 ms-auto" onclick="undoDelete(${fileId})">Undo</button>`
      }
  
      const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
          <div class="toast-header">
            <strong class="me-auto">File Manager</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body d-flex">
            <div class="text-${type} me-auto">${message}</div>
            ${undoButton}
          </div>
        </div>
      `
  
      toastContainer.insertAdjacentHTML("beforeend", toastHTML)
  
      const toastElement = document.getElementById(toastId)
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement)
        toast.show()
  
        // Remove toast from DOM after it's hidden
        toastElement.addEventListener("hidden.bs.toast", () => {
          toastElement.remove()
        })
      }
    }
  
    // Undo delete function (global scope)
    window.undoDelete = (fileId) => {
      fetch("api/restore-file.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "id=" + fileId,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          if (data.success) {
            showToast("File restored successfully", "success")
            window.location.reload()
          } else {
            showToast(data.message || "Error restoring file", "danger")
          }
        })
        .catch((error) => {
          showToast("Error restoring file", "danger")
          console.error("Error:", error)
        })
    }
  })
  