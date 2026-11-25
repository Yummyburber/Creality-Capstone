
document.addEventListener("DOMContentLoaded", async function () {

    const supabase = window._supabase;

    const nameHeading = document.getElementById("profile-name");
    const emailHeading = document.getElementById("profile-email");
    const avatar = document.getElementById("profile-avatar");
    const nameInput = document.getElementById("display-name");
    const emailInput = document.getElementById("display-email");
    const profileForm = document.getElementById("profile-form");
    const saveButton = document.getElementById("save-profile");
    const message = document.getElementById("profile-message");
    const logoutButton = document.getElementById("profile-logout");

    let currentUser = null;

    function getInitials(name) {
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

    function showMessage(text, isError) {
        message.textContent = text;
        message.classList.toggle("error", Boolean(isError));
    }

    function displayUser(user) {
        const name =
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User";

        const email = user.email || "";

        nameHeading.textContent = name;
        emailHeading.textContent = email;
        avatar.textContent = getInitials(name);

        nameInput.value = name;
        emailInput.value = email;
    }

    // Make sure Supabase is available
    if (!supabase) {
        nameHeading.textContent = "Unable to load profile";
        emailHeading.textContent = "Authentication service unavailable.";
        showMessage("Please refresh the page and try again.", true);
        return;
    }

    // Load the currently signed-in user
    try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
            throw error;
        }

        if (!data.user) {
            window.location.href = "login.html";
            return;
        }

        currentUser = data.user;
        displayUser(currentUser);

    } catch (error) {
        console.error("Unable to load profile:", error);
        nameHeading.textContent = "Unable to load profile";
        emailHeading.textContent = "Please try again.";
        showMessage("There was a problem loading your account.", true);
        return;
    }

    // Save updated display name
    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const newName = nameInput.value.trim();

        if (!newName) {
            showMessage("Please enter your name.", true);
            return;
        }

        saveButton.disabled = true;
        saveButton.innerHTML = '<i data-lucide="loader-circle"></i> Saving...';

        if (window.lucide) {
            window.lucide.createIcons();
        }

        try {
            const { data, error } = await supabase.auth.updateUser({
                data: {
                    full_name: newName
                }
            });

            if (error) {
                throw error;
            }

            currentUser = data.user;
            displayUser(currentUser);

            showMessage("Your profile was updated successfully.", false);

        } catch (error) {
            console.error("Unable to update profile:", error);
            showMessage("Unable to save changes: " + error.message, true);

        } finally {
            saveButton.disabled = false;
            saveButton.innerHTML = '<i data-lucide="save"></i> Save Changes';

            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    });

    // Log out
    logoutButton.addEventListener("click", async function () {

        const confirmed = window.confirm("Are you sure you want to log out?");

        if (!confirmed) {
            return;
        }

        logoutButton.disabled = true;
        logoutButton.textContent = "Logging out...";

        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw error;
            }

            window.location.href = "login.html";

        } catch (error) {
            console.error("Unable to log out:", error);
            window.alert("Unable to log out. Please try again.");
            logoutButton.disabled = false;
            logoutButton.innerHTML = '<i data-lucide="log-out"></i> Log Out';

            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    });

});
