<!-- Forgot Password Modal -->
<div class="modal fade" id="forgotPassword" tabindex="-1" aria-labelledby="forgotPasswordLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow-lg rounded">
            <div class="modal-header text-black">
                <h1 class="modal-title fs-5 fw-bolder" id="forgotPasswordLabel">Forgot Password</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body p-4 text-center">
                <p class="text-muted">Enter your email address, and we'll send you instructions to reset your password.</p>
                <form>
                    <div class="mb-3">
                        <input type="email" class="form-control rounded-3 shadow-sm" placeholder="Enter your email">
                    </div>

                    <!-- Submit Button -->
                    <button type="button" class="btn btn-primary w-100 rounded-3 shadow-sm">Send Reset Link</button>
                </form>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary w-100" data-bs-target="#standardLogin" data-bs-toggle="modal">Back to Login</button>
            </div>
        </div>
    </div>
</div>
