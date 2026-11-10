// Profile button and menu in the navbar.
// Front end only for now: the account details below are placeholders until
// the login is connected to the database.
(function () {
    const placeholderUser = { name: "Your Name", email: "you@example.com" };
    let currentUser = placeholderUser;

    const controls = document.querySelector(".nav-controls");
    if (!controls) {
        return;
    }

    const profile = document.createElement("div");
    profile.className = "profile";
    profile.innerHTML =
        '<button type="button" class="profile-button" id="profile-button" aria-haspopup="menu" aria-expanded="false" aria-controls="profile-menu" aria-label="Open profile menu">' +
            '<span class="profile-avatar" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="profile-menu" id="profile-menu" role="menu" aria-labelledby="profile-button"></div>';
    controls.insertBefore(profile, document.getElementById("menu-toggle"));

    const button = profile.querySelector(".profile-button");
    const avatar = profile.querySelector(".profile-avatar");
    const menu = profile.querySelector(".profile-menu");

    // Names and emails will come from the database later, so treat them as plain text
    function escapeText(text) {
        const holder = document.createElement("span");
        holder.textContent = text;
        return holder.innerHTML;
    }

    function initials(name) {
        return name.split(" ").map(function (word) { return word[0]; }).join("").slice(0, 2).toUpperCase();
    }

    function item(icon, label, options) {
        options = options || {};
        const tag = options.href ? "a" : "button";
        const attributes = options.href ? ' href="' + options.href + '"' : ' type="button"';
        const action = options.action ? ' data-action="' + options.action + '"' : "";
        const extraClass = options.danger ? " profile-item--danger" : "";
        return '<' + tag + ' class="profile-item' + extraClass + '" role="menuitem"' + attributes + action + '>' +
            '<i data-lucide="' + icon + '"></i><span>' + label + '</span></' + tag + '>';
    }

    const darkModeItem =
        '<button type="button" class="profile-item" role="menuitemcheckbox" aria-checked="false" data-action="theme">' +
            '<i data-lucide="moon"></i><span>Dark mode</span><span class="profile-switch" aria-hidden="true"></span>' +
        '</button>';

    function render() {
        if (currentUser) {
            avatar.textContent = initials(currentUser.name);
            menu.innerHTML =
                '<div class="profile-header">' +
                    '<span class="profile-avatar profile-avatar--large" aria-hidden="true">' + escapeText(initials(currentUser.name)) + '</span>' +
                    '<div class="profile-details">' +
                        '<strong>' + escapeText(currentUser.name) + '</strong>' +
                        '<span>' + escapeText(currentUser.email) + '</span>' +
                    '</div>' +
                '</div>' +
                item("user-round", "View profile", { action: "soon" }) +
                item("book-open", "My recipes", { action: "soon" }) +
                item("heart", "Favorites", { action: "soon" }) +
                item("shopping-basket", "My pantry", { href: "pantry.html" }) +
                item("calendar-days", "Meal plans", { href: "mealPlan.html" }) +
                '<div class="profile-divider" role="separator"></div>' +
                item("salad", "Diet and allergies", { action: "soon" }) +
                item("settings", "Settings", { action: "soon" }) +
                darkModeItem +
                '<div class="profile-divider" role="separator"></div>' +
                item("circle-help", "Help and feedback", { action: "soon" }) +
                item("log-out", "Log out", { action: "logout", danger: true });
        } else {
            avatar.innerHTML = '<i data-lucide="user-round"></i>';
            menu.innerHTML =
                '<div class="profile-header profile-header--guest">' +
                    '<span class="profile-avatar profile-avatar--large" aria-hidden="true"><i data-lucide="user-round"></i></span>' +
                    '<div class="profile-details">' +
                        '<strong>Welcome!</strong>' +
                        '<span>Log in to save recipes and plans</span>' +
                    '</div>' +
                '</div>' +
                '<div class="profile-actions">' +
                    '<a class="profile-action profile-action--primary" role="menuitem" href="login.html">Log in</a>' +
                    '<a class="profile-action" role="menuitem" href="login.html">Create account</a>' +
                '</div>' +
                '<div class="profile-divider" role="separator"></div>' +
                darkModeItem +
                item("circle-help", "Help and feedback", { action: "soon" });
        }

        // Each item fades in slightly after the one before it
        menu.querySelectorAll("[role^='menuitem']").forEach(function (element, index) {
            element.style.setProperty("--item-index", index);
        });
        syncDarkModeItem();

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function menuItems() {
        return Array.prototype.slice.call(menu.querySelectorAll("[role^='menuitem']"));
    }

    function setOpen(isOpen) {
        // The saved theme is applied after this menu is built, so refresh the switch on open
        if (isOpen) {
            syncDarkModeItem();
        }
        profile.classList.toggle("open", isOpen);
        button.setAttribute("aria-expanded", isOpen);
        button.setAttribute("aria-label", isOpen ? "Close profile menu" : "Open profile menu");
    }

    button.addEventListener("click", function (event) {
        const willOpen = !profile.classList.contains("open");
        setOpen(willOpen);

        // Only one drop-down at a time: close the phone navigation menu
        if (willOpen && typeof window.setMenuOpen === "function") {
            window.setMenuOpen(false);
        }
        // Opened with the keyboard: move focus into the menu
        if (willOpen && event.detail === 0) {
            menuItems()[0].focus();
        }
    });

    const menuToggle = document.getElementById("menu-toggle");
    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            setOpen(false);
        });
    }

    document.addEventListener("click", function (event) {
        if (!profile.contains(event.target)) {
            setOpen(false);
        }
    });

    // Escape closes the menu, arrow keys move between items
    profile.addEventListener("keydown", function (event) {
        if (!profile.classList.contains("open")) {
            return;
        }
        const items = menuItems();
        const position = items.indexOf(document.activeElement);

        if (event.key === "Escape") {
            setOpen(false);
            button.focus();
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            items[(position + 1) % items.length].focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            items[(position - 1 + items.length) % items.length].focus();
        }
    });

    menu.addEventListener("click", function (event) {
        const target = event.target.closest("[data-action]");
        if (!target) {
            return;
        }
        const action = target.dataset.action;

        if (action === "theme") {
            // The theme logic lives in theme.js
            if (typeof window.toggleTheme === "function") {
                window.toggleTheme();
            }
            syncDarkModeItem();
            return;
        }

        setOpen(false);
        if (action === "soon") {
            showToast(target.textContent.trim() + " is coming soon");
        } else if (action === "logout") {
            // Demo only: nothing is connected yet, so just show the logged-out menu
            currentUser = null;
            render();
            showToast("Logged out (preview only)");
        }
    });

    function syncDarkModeItem() {
        const darkModeButton = menu.querySelector("[data-action='theme']");
        if (darkModeButton) {
            darkModeButton.setAttribute("aria-checked", document.body.classList.contains("dark"));
        }
    }

    let toast = null;
    let toastTimer = null;

    function showToast(message) {
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "toast";
            toast.setAttribute("role", "status");
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    render();
})();
