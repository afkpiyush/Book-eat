// Sample login data
const studentDatabase = {
    "piyush.patil24@vit.edu": "12410626",
    "jane@college.edu": "789012"
  };
  
  function togglePassword() {
    const passwordInput = document.getElementById("password");
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  }
  
  function handleLogin() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    if (studentDatabase[email] && studentDatabase[email] === password) {
      alert("Login successful!");
      window.location.href = "choose-canteen.html"; // Redirect
    } else {
      alert("Invalid credentials! Please try again.");
    }
  }
  