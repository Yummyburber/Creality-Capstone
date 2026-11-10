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
        //Fade the colors only while switching, then turn the fade back off
        document.documentElement.classList.add("theme-transition");
        setTimeout(function () {
            document.documentElement.classList.remove("theme-transition");
        }, 400);

        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateToggleLabel();
    });
}

//Phone menu button (only runs if the page has one)
const navbar = document.querySelector(".navbar");
const menuToggle = document.getElementById("menu-toggle");

function setMenuOpen(isOpen) {
    navbar.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

if (navbar && menuToggle) {
    menuToggle.addEventListener("click", function () {
        setMenuOpen(!navbar.classList.contains("menu-open"));
    });

    //Close the menu when a link is chosen or the user clicks somewhere else
    document.addEventListener("click", function (event) {
        if (!navbar.contains(event.target) || event.target.closest(".nav-links a")) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setMenuOpen(false);
        }
    });

    //Reset the menu if the screen grows past phone size
    window.matchMedia("(max-width: 700px)").addEventListener("change", function () {
        setMenuOpen(false);
    });
}
