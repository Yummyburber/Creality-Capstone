// Page animations: hero text reveal, cards that fade in on scroll, and counting stats.
// Load with <script src="animations.js" defer></script>.
// Everything is skipped for people who turn off animations in their device settings.
(function () {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canObserve = "IntersectionObserver" in window;

    // Wait until the page is visible: on pages with the loading screen, start after it fades out
    function whenPageShown(callback) {
        const delay = document.getElementById("page-loader") ? 350 : 0;
        function start() {
            setTimeout(callback, delay);
        }
        if (document.readyState === "complete") {
            start();
        } else {
            window.addEventListener("load", start);
        }
    }

    // ===== Hero text reveal (homepage) =====
    const hero = document.querySelector(".hero");
    if (hero && !reducedMotion) {
        hero.classList.add("hero-wait");
        whenPageShown(function () {
            hero.classList.remove("hero-wait");
            hero.classList.add("hero-in");
        });
    }

    // ===== Cards fade up as they scroll into view =====
    const revealSelector = ".feature-card, .recipe-card, .stat";

    if (!reducedMotion && canObserve) {
        let pageShown = false;
        const waiting = [];

        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

        function watch(element) {
            if (element.classList.contains("reveal")) {
                return;
            }
            // Cards in the same row appear one after another
            const siblings = Array.prototype.filter.call(element.parentElement.children, function (child) {
                return child.matches(revealSelector);
            });
            element.style.setProperty("--reveal-delay", (siblings.indexOf(element) % 4) * 90 + "ms");
            element.classList.add("reveal");

            if (pageShown) {
                revealObserver.observe(element);
            } else {
                waiting.push(element);
            }
        }

        document.querySelectorAll(revealSelector).forEach(watch);

        // Recipe cards are redrawn when searching or filtering, so watch for new ones
        const recipesGrid = document.querySelector(".recipes-grid");
        if (recipesGrid) {
            new MutationObserver(function () {
                recipesGrid.querySelectorAll(".recipe-card").forEach(watch);
            }).observe(recipesGrid, { childList: true });
        }

        whenPageShown(function () {
            pageShown = true;
            waiting.forEach(function (element) {
                revealObserver.observe(element);
            });
        });
    }

    // ===== Numbers that count up (homepage stats) =====
    const numbers = document.querySelectorAll("[data-count]");

    function showNumber(element, value) {
        const decimals = Number(element.dataset.decimals || 0);
        element.textContent = (element.dataset.prefix || "") +
            value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
            (element.dataset.suffix || "");
    }

    function countUp(element) {
        const target = parseFloat(element.dataset.count);
        const duration = 1400;
        const startTime = performance.now();

        function step(now) {
            const progress = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - progress, 3); // fast at first, then slows down
            showNumber(element, target * eased);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    if (numbers.length && !reducedMotion && canObserve) {
        const countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        numbers.forEach(function (element) {
            showNumber(element, 0);
        });
        whenPageShown(function () {
            numbers.forEach(function (element) {
                countObserver.observe(element);
            });
        });
    }
})();
