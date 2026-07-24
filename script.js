// ===== Mobilne menu =====
(function () {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("is-open");
        toggle.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
    });

    // Zamknij menu po kliknięciu w link
    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            nav.classList.remove("is-open");
            toggle.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
})();

// ===== Rok w stopce =====
(function () {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
})();

// ===== Obsługa formularza (Formspree, z fallbackiem na e-mail) =====
(function () {
    const form = document.getElementById("contactForm");
    const note = document.getElementById("formNote");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Jeśli endpoint nie został skonfigurowany — użyj fallbacku mailto.
        const action = form.getAttribute("action") || "";
        if (action.includes("your-form-id")) {
            const data = new FormData(form);
            const subject = encodeURIComponent("Zapytanie ze strony — " + (data.get("service") || ""));
            const body = encodeURIComponent(
                "Imię i nazwisko: " + (data.get("name") || "") + "\n" +
                "Telefon: " + (data.get("phone") || "") + "\n" +
                "E-mail: " + (data.get("email") || "") + "\n" +
                "Usługa: " + (data.get("service") || "") + "\n\n" +
                "Wiadomość:\n" + (data.get("message") || "")
            );
            window.location.href =
                "mailto:kraftdworznicki@gmail.com?subject=" + subject + "&body=" + body;
            if (note) {
                note.style.color = "#1a7f37";
                note.textContent = "Otwieramy Twój program pocztowy z gotową wiadomością...";
            }
            return;
        }

        // Wysyłka przez Formspree (AJAX).
        if (note) { note.style.color = "#4a4a4a"; note.textContent = "Wysyłanie..."; }
        try {
            const response = await fetch(action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" },
            });
            if (response.ok) {
                form.reset();
                if (note) {
                    note.style.color = "#1a7f37";
                    note.textContent =
                        "Dziękujemy! Twoje zapytanie zostało wysłane. Wkrótce się z Tobą skontaktujemy.";
                }
            } else {
                throw new Error("Request failed");
            }
        } catch (err) {
            if (note) {
                note.style.color = "#c0392b";
                note.textContent =
                    "Przepraszamy, wystąpił błąd. Zadzwoń pod +48 508 722 141 lub napisz na kraftdworznicki@gmail.com.";
            }
        }
    });
})();
