$(document).ready(() => {
    $("#signupForm").on("submit", async (e) => {
      e.preventDefault();
  
      const user_name = $("#user_name").val().trim();
      const email = $("#email").val().trim();
      const pass = $("#pass").val().trim();
  
      try {
        const result = await API.signup(user_name, email, pass);
        if (result.success) {
          Swal.fire(
            "Success!",
            "Account created successfully. Please login.",
            "success",
          ).then(() => {
            window.location.href = "login.html";
          });
        } else {
          Swal.fire("Error!", result.message || "Signup failed", "error");
        }
      } catch (err) {
        console.error("DEBUG ERROR:", err);
        Swal.fire('Error!', err.message || 'Server connection error', 'error');
    }
    });
  });