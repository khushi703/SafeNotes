document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.getElementById("menu-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (menuIcon && dropdownMenu) {
        menuIcon.addEventListener("click", () => {
            dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
        });

        // Close the menu when clicking outside
        window.addEventListener("click", (event) => {
            if (event.target !== menuIcon && !dropdownMenu.contains(event.target)) {
                dropdownMenu.style.display = "none";
            }
        });
    }

    // ✅ Signup Form Handling
    const signupForm = document.querySelector("form");

    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission

            // Get input values
            const email = document.querySelector("input[type='email']").value.trim();
            const username = document.querySelector("#username").value.trim();
            const password = document.querySelector("#password").value.trim();
            const signupButton = document.querySelector(".signup-button");

            // Validation rules
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
            const usernameRegex = /[0-9]/; // Must contain at least one number
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            // Validate email
            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            // Validate username
            if (!usernameRegex.test(username)) {
                alert("Username must contain at least one number.");
                return;
            }

            // Validate password
            if (!passwordRegex.test(password)) {
                alert("Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.");
                return;
            }

            // Disable button to prevent multiple clicks
            signupButton.disabled = true;
            signupButton.innerText = "Signing up...";

            // If all validations pass, send the data to the backend
            const userData = { email, username, password };

            try {
                const response = await fetch("http://localhost:8080/api/users/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });

                if (response.ok) {
                    alert("Account created successfully! Please check your email.");
                    signupForm.reset(); // Clear the form after successful signup
                    window.location.href = "Login.html"; // Redirect to login page
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || "Signup failed. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            }

            // Re-enable button
            signupButton.disabled = false;
            signupButton.innerText = "Sign up";
        });
    }
});
