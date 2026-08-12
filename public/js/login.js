$(document).ready(() => {
    $("#loginForm").on("submit", async (e) => {
      e.preventDefault();
  
      const user_name = $("#user_name").val().trim();
      const pass = $("#pass").val().trim();
  
      try {
        const result = await API.signin(user_name, pass);
        if (result.success) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));
          window.location.replace("index.html");
        } else {
          Swal.fire("Error!", result.message || "Login failed", "error");
        }
      } catch (err) {
        console.error("DEBUG ERROR:", err); 
        Swal.fire('Error!', err.message || 'Server connection error', 'error');
    }
    });
  });