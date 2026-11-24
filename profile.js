// Profile button and menu connected to Supabase
(function () {

    const supabase = window._supabase;

    const controls = document.querySelector(".nav-controls");

    if (!controls) {
        return;
    }

    let currentUser = null;

    const profile = document.createElement("div");
    profile.className = "profile";

    profile.innerHTML =
        '<button type="button" class="profile-button" id="profile-button" aria-haspopup="menu" aria-expanded="false" aria-controls="profile-menu" aria-label="Open profile menu">' +
            '<span class="profile-avatar" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="profile-menu" id="profile-menu" role="menu" aria-labelledby="profile-button"></div>';

    const menuToggle = document.getElementById("menu-toggle");

    if (menuToggle) {
        controls.insertBefore(profile, menuToggle);
    } else {
        controls.appendChild(profile);
    }

    const button = profile.querySelector(".profile-button");
    const avatar = profile.querySelector(".profile-avatar");
    const menu = profile.querySelector(".profile-menu");

    function escapeText(text) {
        const holder = document.createElement("span");
        holder.textContent = text || "";
        return holder.innerHTML;
    }

    function initials(name) {
        return (name || "User")
            .trim()
            .split(/\s+/)
            .map(function (word) {
                return word[0];
            })
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    function item(icon, label, options) {
        options = options || {};

        const tag = options.href ? "a" : "button";
        const attributes = options.href
            ? ' href="' + options.href + '"'
            : ' type="button"';

        const action = options.action
            ? ' data-action="' + options.action + '"'
            : "";

        const extraClass = options.danger
            ? " profile-item--danger"
            : "";

        return '<' + tag +
            ' class="profile-item' + extraClass + '"' +
            ' role="menuitem"' + attributes + action + '>' +
            '<i data-lucide="' + icon + '"></i>' +
            '<span>' + label + '</span>' +
            '</' + tag + '>';
    }

    const darkModeItem =
        '<button type="button" class="profile-item" role="menuitemcheckbox" aria-checked="false" data-action="theme">' +
            '<i data-lucide="moon"></i>' +
            '<span>Dark mode</span>' +
            '<span class="profile-switch" aria-hidden="true"></span>' +
        '</button>';

    function render() {

        if (currentUser) {

            const name = currentUser.name || "User";
            const email = currentUser.email || "";

            avatar.textContent = initials(name);

            menu.innerHTML =
                '<div class="profile-header">' +
                    '<span class="profile-avatar profile-avatar--large" aria-hidden="true">' +
                        escapeText(initials(name)) +
                    '</span>' +
                    '<div class="profile-details">' +
                        '<strong>' + escapeText(name) + '</strong>' +
                        '<span>' + escapeText(email) + '</span>' +
                    '</div>' +
                '</div>' +

                item("user-round", "View profile", { action: "soon" }) +
                item("book-open", "My recipes", { action: "soon" }) +
                item("heart", "Favorites", { action: "soon" }) +
                item("shopping-basket", "My pantry", { href: "pantry.html" }) +
                item("calendar-days", "Meal plans", { href: "mealPlan.html" }) +

                '<div class="profile-divider" role="separator"></div>' +

                item("salad", "Diet and allergies", { action: "soon" }) +
                item("settings", "Account Settings", { href: "account-settings.html" }) +
                darkModeItem +

                '<div class="profile-divider" role="separator"></div>' +

                item("circle-help", "Help and feedback", { action: "soon" }) +
                item("log-out", "Log out", { action: "logout", danger: true });

        } else {

            avatar.innerHTML = '<i data-lucide="user-round"></i>';

            menu.innerHTML =
                '<div class="profile-header profile-header--guest">' +
                    '<span class="profile-avatar profile-avatar--large" aria-hidden="true">' +
                        '<i data-lucide="user-round"></i>' +
                    '</span>' +
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

        menu.querySelectorAll("[role^='menuitem']").forEach(function (element, index) {
            element.style.setProperty("--item-index", index);
        });

        syncDarkModeItem();

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function menuItems() {
        return Array.prototype.slice.call(
            menu.querySelectorAll("[role^='menuitem']")
        );
    }

    function setOpen(isOpen) {
        if (isOpen) {
            syncDarkModeItem();
        }

        profile.classList.toggle("open", isOpen);

        button.setAttribute("aria-expanded", isOpen);
        button.setAttribute(
            "aria-label",
            isOpen ? "Close profile menu" : "Open profile menu"
        );
    }

    button.addEventListener("click", function (event) {

        const willOpen = !profile.classList.contains("open");

        setOpen(willOpen);

        if (willOpen && typeof window.setMenuOpen === "function") {
            window.setMenuOpen(false);
        }

        if (willOpen && event.detail === 0) {
            const items = menuItems();

            if (items.length > 0) {
                items[0].focus();
            }
        }
    });

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

            if (items.length > 0) {
                items[(position + 1) % items.length].focus();
            }

        } else if (event.key === "ArrowUp") {
            event.preventDefault();

            if (items.length > 0) {
                items[(position - 1 + items.length) % items.length].focus();
            }
        }
    });

    menu.addEventListener("click", async function (event) {

        const target = event.target.closest("[data-action]");

        if (!target) {
            return;
        }

        const action = target.dataset.action;

        if (action === "theme") {

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

            if (!supabase) {
                showToast("Supabase is not available.");
                return;
            }

            const { error } = await supabase.auth.signOut();

            if (error) {
                showToast("Unable to log out: " + error.message);
                return;
            }

            currentUser = null;
            render();

            showToast("You have successfully logged out.");

            window.location.href = "login.html";
        }
    });

    function syncDarkModeItem() {

        const darkModeButton = menu.querySelector("[data-action='theme']");

        if (darkModeButton) {
            darkModeButton.setAttribute(
                "aria-checked",
                document.body.classList.contains("dark")
            );
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

    // Load the real signed-in user
    async function loadUser() {

        if (!supabase) {
            render();
            return;
        }

        const { data, error } = await supabase.auth.getUser();

        if (error) {
            console.error("Unable to load profile:", error.message);
        }

        if (data && data.user) {
            const user = data.user;

            currentUser = {
                name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
                email: user.email || ""
            };
        } else {
            currentUser = null;
        }

        render();
    }

    render();
    loadUser();

    if (supabase) {
        supabase.auth.onAuthStateChange(function (_event, session) {

            if (session && session.user) {
                currentUser = {
                    name: session.user.user_metadata?.full_name ||
                        session.user.email?.split("@")[0] || "User",
                    email: session.user.email || ""
                };
            } else {
                currentUser = null;
            }

            render();
        });
    }

})();