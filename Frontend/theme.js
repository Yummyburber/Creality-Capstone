//saved theme on page load (falls back to the device's setting if none is saved)
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark");
}

//Toggle button (only runs if the page has one)
const themeToggle = document.getElementById("theme-toggle");

//Keeps the button's label in sync for screen readers
function updateToggleLabel() {
    const isDark = document.body.classList.contains("dark");
    themeToggle.setAttribute("aria-pressed", isDark);
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.title = isDark ? "Light mode" : "Dark mode";
}

if (themeToggle) {
    updateToggleLabel();

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateToggleLabel();
    });
}
