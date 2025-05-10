$(document).ready(() => {
   $("#myTable").DataTable()
 
   // Save student (Add new user)
   $(document).on("submit", "#saveStudent", function (e) {
     e.preventDefault()
 
     var formData = new FormData(this)
     formData.append("save_student", true)
 
     $.ajax({
       type: "POST",
       url: "action.php",
       data: formData,
       processData: false,
       contentType: false,
       success: (response) => {
         var res = JSON.parse(response)
         if (res.status == 422) {
           $("#errorMessage").removeClass("d-none")
           $("#errorMessage").text(res.message)
         } else if (res.status == 200) {
           $("#addUser").modal("hide")
           $("#saveStudent")[0].reset()
           $("#errorMessage").addClass("d-none")
 
           $("#myTable").load(location.href + " #myTable")
           Swal.fire({
             position: "top-end",
             icon: "success",
             title: "User has been added successfully",
             showConfirmButton: false,
             timer: 1500,
           })
         } else {
           $("#errorMessage").removeClass("d-none")
           $("#errorMessage").text("Something went wrong")
         }
       },
       error: (xhr, status, error) => {
         console.error(error)
         $("#errorMessage").removeClass("d-none")
         $("#errorMessage").text("An error occurred while processing your request")
       },
     })
   })
 
   // View student
   $(document).on("click", "#viewStudent", function () {
     var student_id = $(this).val()
 
     $.ajax({
       type: "GET",
       url: "action.php?student_id=" + student_id,
       success: (response) => {
         try {
           var res = JSON.parse(response)
           if (res.status == 500) {
             console.log(res.message)
             Swal.fire("Error!", res.message, "error")
           } else if (res.status == 200) {
             $("#viewEmail").text(res.data.email)
             $("#viewName").text(res.data.name)
             $("#viewPhone").text(res.data.phone)
             $("#viewCourse").text(res.data.course)
             $("#viewStudentModal").modal("show")
           }
         } catch (e) {
           console.error("Error parsing JSON:", e)
           Swal.fire("Error!", "Failed to parse server response", "error")
         }
       },
       error: (xhr, status, error) => {
         console.error(error)
         Swal.fire("Error!", "Failed to fetch student data", "error")
       },
     })
   })
 
   // Edit student - Open modal and populate data
   $(document).on("click", "#editStudent", function () {
     var student_id = $(this).val()
     $("#student_id_input").val(student_id)
 
     $.ajax({
       type: "GET",
       url: "action.php?student_id=" + student_id,
       success: (response) => {
         try {
           var res = JSON.parse(response)
           if (res.status == 500) {
             console.log(res.message)
             Swal.fire("Error!", res.message, "error")
           } else if (res.status == 200) {
             $("#Email").val(res.data.email)
             $("#Name").val(res.data.name)
             $("#Phone").val(res.data.phone)
             $("#Course").val(res.data.course)
             $("#editStudentModal").modal("show")
           }
         } catch (e) {
           console.error("Error parsing JSON:", e)
           Swal.fire("Error!", "Failed to parse server response", "error")
         }
       },
       error: (xhr, status, error) => {
         console.error(error)
         Swal.fire("Error!", "Failed to fetch student data", "error")
       },
     })
   })
 
   // Update student
   $(document).on("submit", "#updateStudent", function (e) {
     e.preventDefault()
 
     var formData = new FormData(this)
     formData.append("update_student", true)
 
     $.ajax({
       type: "POST",
       url: "action.php",
       data: formData,
       processData: false,
       contentType: false,
       success: (response) => {
         try {
           var res = JSON.parse(response)
           if (res.status == 422) {
             $("#errorMessageUpdate").removeClass("d-none")
             $("#errorMessageUpdate").text(res.message)
           } else if (res.status == 200) {
             $("#editStudentModal").modal("hide")
             $("#updateStudent")[0].reset()
             $("#errorMessageUpdate").addClass("d-none")
 
             $("#myTable").load(location.href + " #myTable")
             Swal.fire({
               position: "top-end",
               icon: "success",
               title: "User has been updated successfully",
               showConfirmButton: false,
               timer: 1500,
             })
           } else {
             $("#errorMessageUpdate").removeClass("d-none")
             $("#errorMessageUpdate").text("Something went wrong")
           }
         } catch (e) {
           console.error("Error parsing JSON:", e)
           $("#errorMessageUpdate").removeClass("d-none")
           $("#errorMessageUpdate").text("Failed to parse server response")
         }
       },
       error: (xhr, status, error) => {
         console.error(error)
         $("#errorMessageUpdate").removeClass("d-none")
         $("#errorMessageUpdate").text("An error occurred while processing your request")
       },
     })
   })
 
   // Delete student
   $(document).on("click", "#deleteStudent", function (e) {
     e.preventDefault()
     var student_id = $(this).val()
 
     Swal.fire({
       title: "Are you sure?",
       text: "You won't be able to revert this!",
       icon: "warning",
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33",
       confirmButtonText: "Yes, delete it!",
     }).then((result) => {
       if (result.isConfirmed) {
         $.ajax({
           type: "POST",
           url: "action.php",
           data: {
             delete_student: true,
             student_id: student_id,
           },
           success: (response) => {
             try {
               var res = JSON.parse(response)
               if (res.status == 200) {
                 Swal.fire("Deleted!", res.message, "success")
                 $("#myTable").load(location.href + " #myTable")
               } else {
                 Swal.fire("Error!", res.message, "error")
               }
             } catch (e) {
               console.error("Error parsing JSON:", e)
               Swal.fire("Error!", "Failed to parse server response", "error")
             }
           },
           error: (xhr, status, error) => {
             console.error(error)
             Swal.fire("Error!", "Failed to delete student", "error")
           },
         })
       }
     })
   })
 })
 