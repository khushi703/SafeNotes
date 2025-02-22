
    const menuIcon = document.getElementById("menu-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    menuIcon.addEventListener("click", () => {
    dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
});

    // Close the menu when clicking outside
    window.addEventListener("click", (event) => {
    if (event.target !== menuIcon && !dropdownMenu.contains(event.target)) {
    dropdownMenu.style.display = "none";
}
});
    // sign up
    document.addEventListener("DOMContentLoaded", function () {
        const signupForm = document.querySelector("form");

        signupForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            // Get input values
            const email = document.querySelector("input[type='email']").value;
            const username = document.querySelector("#username").value;
            const password = document.querySelector("#password").value;

            // Validation rules
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
            const usernameRegex = /[0-9]/; // Must contain at least one number
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character

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
                alert(
                    "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character."
                );
                return;
            }

            // If all validations pass, send the data to the backend
            const userData = {
                email: email,
                username: username,
                password: password,
            };

            // Submit data via a POST request to the backend
            fetch("http://localhost:8080/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Account created successfully! Please check your email.");
                        signupForm.reset(); // Clear the form after successful signup
                    } else {
                        alert("Signup failed. Please try again.");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("An error occurred. Please try again later.");
                });
        });
    });
