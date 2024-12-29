document.getElementById('login-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value.trim();
    if (username) {
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("username", username);
        window.location.href = "home.html"; // Redirect to home page
    } else {
        document.getElementById('error-message').textContent = "Please enter a valid username.";
    }
});
