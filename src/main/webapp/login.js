document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");
    const googleLoginButton = document.querySelector(".wordpress-login-button");

    // ✅ Handle JWT-based login
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get input values
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;

        // Prepare login data
        const loginData = {
            username: username,
            password: password
        };

        // Send POST request for authentication
        fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Login failed. Please check your credentials.");
                }
                return response.json();
            })
            .then(data => {
                // ✅ Store JWT token in localStorage
                localStorage.setItem("jwtToken", data.token);

                // ✅ Redirect to home/dashboard page
                alert("Login successful! Redirecting...");
                window.location.href = "home.html";  // Change to your actual dashboard/home page
            })
            .catch(error => {
                console.error("Error:", error);
                alert(error.message);
            });
    });

    // ✅ Handle Google OAuth Login
    googleLoginButton.addEventListener("click", function () {
        window.location.href = "http://localhost:8080/oauth2/authorize/google";
    });
});
