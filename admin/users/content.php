<!-- MAIN -->
<main>
  <h1 class="title">Users</h1>
  <div class="custom-container">
    <div class="custom-header d-flex justify-content-between align-items-center mb-3">
      <h2>Registered Students</h2>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userModal">Add Student</button>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-bordered align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>van</td>
            <td>van@gmail.com</td>
            <td>Hash</td>
            <td><button class="btn btn-success btn-sm">Edit</button></td>
            <td><button class="btn btn-danger btn-sm">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Bootstrap Modal -->
  <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content custom-modal">
        <div class="modal-header">
          <h5 class="modal-title" id="userModalLabel">Add / Edit Student</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username">
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password">
            </div>
            <button type="submit" class="btn btn-primary w-100">Save</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</main>