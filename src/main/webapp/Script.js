
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

