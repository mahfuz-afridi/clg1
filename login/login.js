/* ==========================================================
   BAF Shaheen College Chattogram — login page behaviour
   (Formerly login.java: the contents were always browser
   JavaScript, so it now has the matching .js extension.)
   1. Theme   2. Password show/hide   3. Login form
   4. Missing-image handling
========================================================== */

(function () {
    "use strict";

    var root = document.documentElement;
    var THEME_KEY = "baf-theme"; /* same key as the homepage */
    var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");


    /* ======================================================
       1. THEME (shared with the homepage)
    ====================================================== */

    function readStoredTheme() {
        try {
            var value = localStorage.getItem(THEME_KEY);
            return value === "light" || value === "dark" ? value : null;
        } catch (e) {
            return null;
        }
    }

    var themeButton = document.getElementById("themeToggle");

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        if (themeButton) {
            themeButton.setAttribute(
                "aria-label",
                theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            );
        }
    }

    function currentTheme() {
        return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }

    applyTheme(readStoredTheme() || (darkQuery.matches ? "dark" : "light"));

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            var next = currentTheme() === "dark" ? "light" : "dark";

            root.classList.add("theme-animating");
            window.setTimeout(function () {
                root.classList.remove("theme-animating");
            }, 300);

            applyTheme(next);
            try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage blocked */ }
        });
    }

    window.addEventListener("pageshow", function (event) {
        if (event.persisted) { applyTheme(readStoredTheme() || currentTheme()); }
    });

    window.addEventListener("storage", function (event) {
        if (event.key === THEME_KEY && (event.newValue === "light" || event.newValue === "dark")) {
            applyTheme(event.newValue);
        }
    });


    /* ======================================================
       2. PASSWORD SHOW / HIDE
    ====================================================== */

    var passwordInput = document.getElementById("password");
    var togglePassword = document.getElementById("togglePassword");

    if (passwordInput && togglePassword) {
        togglePassword.addEventListener("click", function () {
            var show = passwordInput.type === "password";

            passwordInput.type = show ? "text" : "password";
            togglePassword.innerHTML = show
                ? '<i class="fa-solid fa-eye-slash" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-eye" aria-hidden="true"></i>';
            togglePassword.setAttribute("aria-label", show ? "Hide password" : "Show password");
        });
    }


    /* ======================================================
       3. LOGIN FORM (validation only — no backend connected)
    ====================================================== */

    var loginForm = document.getElementById("loginForm");
    var loginMessage = document.getElementById("loginMessage");
    var loginIdInput = document.getElementById("loginId");

    function setMessage(text, kind) {
        loginMessage.classList.remove("is-error", "is-info");
        loginMessage.classList.add(kind);
        loginMessage.textContent = text;
    }

    if (loginForm && loginMessage && loginIdInput && passwordInput) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var loginId = loginIdInput.value.trim();
            var password = passwordInput.value.trim();

            [loginIdInput, passwordInput].forEach(function (input) {
                input.parentNode.classList.remove("is-invalid");
                input.removeAttribute("aria-invalid");
            });

            if (loginId === "" || password === "") {
                var empty = loginId === "" ? loginIdInput : passwordInput;
                [loginIdInput, passwordInput].forEach(function (input) {
                    if (input.value.trim() === "") {
                        input.parentNode.classList.add("is-invalid");
                        input.setAttribute("aria-invalid", "true");
                    }
                });
                setMessage("Please enter your Login ID and Password.", "is-error");
                empty.focus();
                return;
            }

            /*
                এখানে পরে তোমার real login system
                connect করতে পারবে।
            */

            /* No authentication backend is connected, so do not claim a login. */
            setMessage(
                "Details look complete, but login is not connected to a server yet.",
                "is-info"
            );
        });
    }


    /* ======================================================
       4. MISSING IMAGES — fail quietly
    ====================================================== */

    Array.prototype.forEach.call(document.images, function (img) {
        var markMissing = function () { img.classList.add("is-missing"); };

        if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
            markMissing();
        }
        img.addEventListener("error", markMissing);
        img.addEventListener("load", function () {
            img.classList.remove("is-missing");
        });
    });

})();
