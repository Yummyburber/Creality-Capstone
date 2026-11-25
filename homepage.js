// Homepage: scroll effects and the interactive "How it works" demo.
// Styles live in home.css. Cards and rows fading in on scroll are handled by animations.js.
(function () {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const progressBar = document.querySelector(".scroll-progress");
    const hero = document.querySelector(".hero--full");

    // ===== Progress bar and photo parallax, updated once per frame while scrolling =====
    let ticking = false;

    function updateOnScroll() {
        ticking = false;
        const scrolled = window.scrollY;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;

        if (progressBar) {
            progressBar.style.transform = "scaleX(" + (scrollable > 0 ? scrolled / scrollable : 0) + ")";
        }

        // 0 at the top of the page, 1 once the photo has scrolled out of view
        if (hero && !reducedMotion) {
            const progress = Math.min(1, scrolled / hero.offsetHeight);
            hero.style.setProperty("--hero-progress", progress.toFixed(3));
        }
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateOnScroll);
        }
    }, { passive: true });
    window.addEventListener("resize", updateOnScroll);
    updateOnScroll();

    // ===== Small drawn ingredients used in the demo =====
    const ingredientArt = {
        tomato: '<svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="14" fill="#e2463a"/><path d="M13 11l7 4 7-4-4 6h-6z" fill="#4c9a5b"/><circle cx="15" cy="18" r="3" fill="#fff" opacity=".35"/></svg>',
        egg: '<svg viewBox="0 0 40 40"><ellipse cx="20" cy="22" rx="16" ry="12" fill="#fffdf6" stroke="#e6dccb"/><circle cx="21" cy="22" r="6" fill="#f4b81f"/><circle cx="19" cy="20" r="2" fill="#fff" opacity=".6"/></svg>',
        spinach: '<svg viewBox="0 0 40 40"><path d="M8 30C8 14 20 6 33 7c1 14-8 26-25 23z" fill="#4c9a5b"/><path d="M9 30C16 22 23 15 31 9" stroke="#2f6b3c" stroke-width="2" fill="none"/></svg>',
        rice: '<svg viewBox="0 0 40 40"><path d="M5 19h30c0 10-7 16-15 16S5 29 5 19z" fill="#d85a30"/><ellipse cx="20" cy="19" rx="15" ry="5" fill="#f8f4ea"/><circle cx="14" cy="17" r="1.5" fill="#e6dccb"/><circle cx="22" cy="16" r="1.5" fill="#e6dccb"/><circle cx="26" cy="19" r="1.5" fill="#e6dccb"/></svg>',
        garlic: '<svg viewBox="0 0 40 40"><path d="M20 6c2 6 13 10 13 19 0 7-6 10-13 10S7 32 7 25c0-9 11-13 13-19z" fill="#f4efe4" stroke="#d9cfbe"/><path d="M20 12v22M14 17c-2 6-1 12 2 16M26 17c2 6 1 12-2 16" stroke="#d9cfbe" fill="none"/></svg>',
        carrot: '<svg viewBox="0 0 40 40"><path d="M28 10L8 33c-1 1 0 2 1 1l23-20z" fill="#f08a24"/><path d="M27 11l6-7M29 13l7-3M26 9l2-7" stroke="#4c9a5b" stroke-width="3" stroke-linecap="round"/></svg>',
        chicken: '<svg viewBox="0 0 40 40"><path d="M23 6c8 0 13 6 12 13-1 8-9 12-16 10l-6 6c-2 2-6-1-4-4l6-6C11 17 15 6 23 6z" fill="#c98f52"/><path d="M9 30l-4 1 1 3 3-1z" fill="#f4efe4"/></svg>',
        broccoli: '<svg viewBox="0 0 40 40"><rect x="17" y="22" width="6" height="14" rx="2" fill="#8bbf6a"/><circle cx="13" cy="17" r="8" fill="#3f7d3a"/><circle cx="27" cy="17" r="8" fill="#3f7d3a"/><circle cx="20" cy="11" r="8" fill="#4c9a5b"/></svg>'
    };

    // Positions around the pot for each ingredient token (cupboard step 1)
    const tokenSpots = {
        tomato: [-110, -38, -15], egg: [110, -40, 10], spinach: [-122, 28, 20],
        rice: [118, 30, -10], garlic: [-62, -66, 5], carrot: [66, -64, -25]
    };

    document.querySelectorAll(".how-token-inline").forEach(function (holder) {
        holder.innerHTML = ingredientArt[holder.dataset.ingredient] || "";
    });

    // ===== Cupboard step 1: tap an ingredient to drop it into the pot (or take it out) =====
    const scene = document.querySelector(".how-scene");
    const chips = Array.prototype.slice.call(document.querySelectorAll(".how-chip"));
    const tokens = {};

    if (scene) {
        chips.forEach(function (chip, index) {
            const name = chip.dataset.ingredient;
            const spot = tokenSpots[name] || [0, -60, 0];
            const token = document.createElement("span");
            token.className = "how-token";
            token.innerHTML = ingredientArt[name] || "";
            token.style.setProperty("--x", spot[0] + "px");
            token.style.setProperty("--y", spot[1] + "px");
            token.style.setProperty("--r", spot[2] + "deg");
            token.style.setProperty("--i", index);
            scene.appendChild(token);
            tokens[name] = token;

            chip.addEventListener("click", function () {
                const selected = chip.getAttribute("aria-pressed") !== "true";
                chip.setAttribute("aria-pressed", String(selected));
                token.style.setProperty("--i", 0);
                token.classList.toggle("in-pot", selected);
                bumpPot();
                updateCooking();
            });
        });
    }

    function bumpPot() {
        if (!scene || reducedMotion) {
            return;
        }
        scene.classList.remove("is-bumped");
        void scene.offsetWidth; // restarts the bump animation
        scene.classList.add("is-bumped");
    }

    function updateCooking() {
        if (scene) {
            scene.classList.toggle("is-cooking", chips.some(function (chip) {
                return chip.getAttribute("aria-pressed") === "true";
            }));
        }
    }

    // Selected ingredients start beside the pot and drop in one by one when the step comes up
    function playCupboardScene() {
        chips.forEach(function (chip, index) {
            const token = tokens[chip.dataset.ingredient];
            if (!token) {
                return;
            }
            token.classList.remove("in-pot");
            token.style.setProperty("--i", index);
        });
        void (scene && scene.offsetWidth);
        setTimeout(function () {
            chips.forEach(function (chip) {
                const token = tokens[chip.dataset.ingredient];
                if (token && chip.getAttribute("aria-pressed") === "true") {
                    token.classList.add("in-pot");
                }
            });
            updateCooking();
        }, reducedMotion ? 0 : 450);
    }

    // ===== Stores step 1: the ZIP code types itself, then the map pin and store appear =====
    let typingTimer = null;

    function playZipScene(screen) {
        const typed = screen.querySelector(".how-typed");
        if (!typed) {
            return;
        }
        const text = typed.dataset.text || "";
        clearTimeout(typingTimer);
        screen.classList.remove("found");
        typed.textContent = "";

        if (reducedMotion) {
            typed.textContent = text;
            screen.classList.add("found");
            return;
        }

        let shown = 0;
        (function typeNext() {
            shown++;
            typed.textContent = text.slice(0, shown);
            if (shown < text.length) {
                typingTimer = setTimeout(typeNext, 140);
            } else {
                typingTimer = setTimeout(function () {
                    screen.classList.add("found");
                }, 250);
            }
        })();
    }

    // ===== How it works: two paths, three steps each =====
    const stepsList = document.querySelector(".how-steps");
    const steps = Array.prototype.slice.call(document.querySelectorAll(".how-step"));
    const screens = Array.prototype.slice.call(document.querySelectorAll(".how-screen"));
    const pathButtons = Array.prototype.slice.call(document.querySelectorAll(".path-option"));
    let currentPath = "cupboard";
    let currentStep = 0;

    function showStep(number) {
        if (number === currentStep) {
            return;
        }
        currentStep = number;

        steps.forEach(function (step) {
            step.classList.toggle("is-active", step.dataset.path === currentPath && Number(step.dataset.step) === number);
        });
        screens.forEach(function (screen) {
            const active = screen.dataset.path === currentPath && Number(screen.dataset.screen) === number;
            screen.classList.toggle("is-active", active);

            if (active && screen.querySelector(".how-scene")) {
                playCupboardScene();
            }
            if (active && screen.querySelector(".how-zip")) {
                playZipScene(screen);
            }
        });
        if (stepsList) {
            stepsList.style.setProperty("--how-progress", (number - 1) / 2);
        }
    }

    // The step closest to the reading line (middle of the screen, lower on phones)
    function stepAtReadingLine() {
        const line = window.innerHeight * (window.matchMedia("(max-width: 800px)").matches ? 0.7 : 0.5);
        let best = 1;
        let bestDistance = Infinity;
        steps.forEach(function (step) {
            if (step.hidden) {
                return;
            }
            const box = step.getBoundingClientRect();
            const distance = Math.abs(box.top + box.height / 2 - line);
            if (distance < bestDistance) {
                bestDistance = distance;
                best = Number(step.dataset.step);
            }
        });
        return best;
    }

    function setPath(path) {
        if (!steps.length) {
            return;
        }
        currentPath = path;
        pathButtons.forEach(function (button) {
            button.setAttribute("aria-pressed", String(button.dataset.path === path));
        });
        steps.forEach(function (step) {
            step.hidden = step.dataset.path !== path;
        });
        currentStep = 0;
        showStep(stepAtReadingLine());
    }

    pathButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            setPath(button.dataset.path);
        });
    });

    if (steps.length) {
        setPath("cupboard");

        if ("IntersectionObserver" in window) {
            // A step counts as current when it crosses a thin band at the reading line
            const stepObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !entry.target.hidden) {
                        showStep(Number(entry.target.dataset.step));
                    }
                });
            }, {
                // On phones the example screen is pinned to the top, so read the steps lower down
                rootMargin: window.matchMedia("(max-width: 800px)").matches ? "-62% 0px -28% 0px" : "-45% 0px -45% 0px"
            });

            steps.forEach(function (step) {
                stepObserver.observe(step);
            });
        }
    }

    // Buttons that jump to "How it works" pick a path first, then glide down instead of jumping
    document.querySelectorAll('a[href="#how-it-works"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const target = document.getElementById("how-it-works");
            if (!target) {
                return;
            }
            event.preventDefault();
            if (link.dataset.path) {
                setPath(link.dataset.path);
            }
            target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        });
    });
})();
