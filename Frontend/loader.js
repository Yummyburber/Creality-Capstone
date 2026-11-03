// Page loader: our hot pot logo, simmering, covers the page while it loads.
// Include it as the first thing inside <body> so it shows before the page does:
//     <script src="loader.js"></script>
// Other scripts can also use it while waiting on something (like the database):
//     MealLoader.show();  ...  MealLoader.hide();
(function () {
    // Ingredient shapes, each drawn around its own center (0, 0)
    const ingredients = {
        tomato: '<circle r="8" fill="#e2463a"/><path d="M-4 -7 Q0 -11 4 -7 Q0 -5 -4 -7Z" fill="#4c9a5b"/>',
        carrot: '<circle r="7" fill="#f08a24"/><circle r="3.5" fill="#f6b15c"/>',
        basil: '<path d="M-8 4 Q-3 -8 8 -3 Q2 7 -8 4Z" fill="#4c9a5b"/><path d="M-6 3 Q0 -1 6 -2" stroke="#3a7a48" stroke-width="1" fill="none"/>',
        mushroom: '<path d="M-8 0 Q-8 -8 0 -8 Q8 -8 8 0Z" fill="#b5835a"/><rect x="-3" y="0" width="6" height="7" rx="2" fill="#efe2cf"/>',
        cheese: '<path d="M-8 5 L8 5 L8 -5 Z" fill="#f4c542"/><circle cx="4" cy="2" r="1.3" fill="#d9a92a"/>'
    };

    // Bubbles pop on the empty parts of the pan in the logo (512 x 512 image coordinates)
    const bubbleSpots = [[70, 170], [150, 90], [420, 140], [440, 350], [330, 440], [60, 250], [200, 460]];
    let bubbles = "";
    bubbleSpots.forEach(function (spot, i) {
        bubbles += '<circle class="pl-bubble" cx="' + spot[0] + '" cy="' + spot[1] + '" r="11" style="animation-delay:' + (i * 0.37).toFixed(2) + 's"/>';
    });

    // The logo image, with a yolk drawn exactly over the one in the picture so it can wobble
    const potSvg =
        '<svg viewBox="0 0 512 512" aria-hidden="true">' +
            '<g class="pl-pot">' +
                '<g class="pl-stir">' +
                    '<image href="Images/hot-pot%20(1).png" width="512" height="512"/>' +
                    bubbles +
                    '<g class="pl-yolk">' +
                        '<circle cx="255.5" cy="255.5" r="48" fill="#ffcb1e"/>' +
                        '<circle cx="239.5" cy="247.5" r="15" fill="#ffe078"/>' +
                    '</g>' +
                    '<g class="pl-tosses"></g>' +
                '</g>' +
            '</g>' +
            '<g class="pl-steam">' +
                '<path d="M196 110 q-22 -30 0 -60 q22 -30 0 -60"/>' +
                '<path d="M256 85 q-22 -30 0 -60 q22 -30 0 -60" style="animation-delay:0.9s"/>' +
                '<path d="M316 110 q-22 -30 0 -60 q22 -30 0 -60" style="animation-delay:1.7s"/>' +
            '</g>' +
        '</svg>';

    // Match the saved theme right away (theme.js runs later, at the end of the page)
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const loader = document.createElement("div");
    loader.id = "page-loader";
    loader.className = "page-loader";
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        loader.classList.add("is-dark");
    }
    loader.innerHTML =
        '<button type="button" class="page-loader__pot" aria-label="Toss an ingredient into the pot">' + potSvg + '</button>' +
        '<p class="page-loader__text" role="status" aria-live="polite">Loading' +
            '<span class="page-loader__dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>' +
        '</p>';

    const pot = loader.querySelector(".pl-pot");
    const tosses = loader.querySelector(".pl-tosses");

    function show() {
        loader.classList.toggle("is-dark", document.body.classList.contains("dark"));
        loader.classList.remove("is-hidden");
    }

    function hide() {
        loader.classList.add("is-hidden");
    }

    // Clicking the pot throws a random ingredient in
    loader.querySelector(".page-loader__pot").addEventListener("click", function () {
        const names = Object.keys(ingredients);
        const name = names[Math.floor(Math.random() * names.length)];
        // Land somewhere in the middle of the pot, at a random angle
        const x = 256 + (Math.random() - 0.5) * 240;
        const y = 256 + (Math.random() - 0.5) * 240;
        const angle = Math.round(Math.random() * 360);
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
        wrapper.setAttribute("transform", "translate(" + x + " " + y + ") rotate(" + angle + ") scale(4.5)");
        wrapper.innerHTML = '<g class="pl-toss">' + ingredients[name] + '</g>';
        // Without animations the ingredient would never fall in, so skip it
        if (!reducedMotion) {
            tosses.appendChild(wrapper);
            wrapper.firstChild.addEventListener("animationend", function () {
                wrapper.remove();
            });
        }

        pot.classList.remove("is-bumped");
        void pot.getBoundingClientRect(); // restarts the bump animation
        pot.classList.add("is-bumped");
    });

    if (document.body) {
        document.body.appendChild(loader);
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            document.body.appendChild(loader);
        });
    }

    // Hide once the page (including images) has finished loading
    window.addEventListener("load", hide);
    // Never get stuck on screen if something fails to load
    setTimeout(hide, 10000);

    // Coming back with the browser's Back button can restore the page with the loader still up
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            hide();
        }
    });

    // Show the loader when leaving for another page on this site
    document.addEventListener("click", function (event) {
        const link = event.target.closest("a[href]");
        if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }
        if ((link.target && link.target !== "_self") || link.hasAttribute("download")) {
            return;
        }

        const url = new URL(link.href, location.href);
        const samePage = url.pathname === location.pathname && url.search === location.search;
        if (url.origin !== location.origin || (samePage && url.hash) || link.getAttribute("href") === "#") {
            return;
        }

        // Skip links that another script already handled
        if (!event.defaultPrevented) {
            show();
        }
    });

    // Forms that actually send the browser somewhere (not ones handled by JavaScript, like login)
    document.addEventListener("submit", function (event) {
        if (!event.defaultPrevented) {
            show();
        }
    });

    window.MealLoader = { show: show, hide: hide };
})();
