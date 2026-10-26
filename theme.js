//saved theme on page load
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

//Toggle button (only runs if the page has one)
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}