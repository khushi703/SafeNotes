document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    if (!loginForm) {
        console.error("Login form not found!");
        return;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem("authToken", data.token); // ✅ Store Token Correctly
                window.location.href = "home.html"; // ✅ Redirect to Home Page
            } else {
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
