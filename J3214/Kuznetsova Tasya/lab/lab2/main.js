/* =========================================================
   TRAVELLY — MAIN JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       Плавная прокрутка
       ----------------------------------------------------- */

    document.querySelectorAll("[data-scroll-target]").forEach(button => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scrollTarget);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


    /* -----------------------------------------------------
       Лайки
       ----------------------------------------------------- */

    document
        .querySelectorAll(".like-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const liked =
                    button.classList.toggle("liked");

                const icon =
                    button.querySelector(".like-icon");

                if (icon) {
                    icon.textContent =
                        liked ? "♥" : "♡";
                } else {
                    button.textContent =
                        liked ? "♥" : "♡";
                }
            });
        });


    /* -----------------------------------------------------
       Hero one-page actions
       ----------------------------------------------------- */

    document.querySelectorAll('.hero-action-card[href^="#"]').forEach(link => {

        link.addEventListener('click', event => {

            const id = link.getAttribute('href');
            const target = id ? document.querySelector(id) : null;

            if (!target) return;

            event.preventDefault();

            const offset = 84;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    /* -----------------------------------------------------
       Category links
       ----------------------------------------------------- */

    document
        .querySelectorAll(".category-link")
        .forEach(link => {

            link.addEventListener("click", () => {

                document
                    .querySelectorAll(".category-link")
                    .forEach(item => {
                        item.classList.remove("active");
                    });

                link.classList.add("active");
            });
        });


    /* -----------------------------------------------------
       Scroll animations
       ----------------------------------------------------- */

    const animatedElements =
        document.querySelectorAll(
            ".animate-on-scroll"
        );

    if (
        animatedElements.length &&
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    });
                },
                {
                    threshold: 0.12
                }
            );

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }


    /* -----------------------------------------------------
       Active navbar
       ----------------------------------------------------- */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() || "index.html";

    document
        .querySelectorAll(".navbar .nav-link")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (
                href &&
                href === currentPage
            ) {

                link.classList.add("active");
            }
        });


    /* -----------------------------------------------------
       Back to top
       ----------------------------------------------------- */

    const backToTop =
        document.getElementById("backToTop");

    if (backToTop) {

        window.addEventListener("scroll", () => {

            backToTop.classList.toggle(
                "show",
                window.scrollY > 500
            );
        });

        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }


    /* -----------------------------------------------------
       Card animation delay
       ----------------------------------------------------- */

    document
        .querySelectorAll(".destination-card, .post-card")
        .forEach((card, index) => {

            card.style.animationDelay =
                `${index * 0.08}s`;
        });


    /* -----------------------------------------------------
       Escape
       ----------------------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                document.activeElement?.blur();
            }
        }
    );


    console.log(
        "Travelly loaded successfully."
    );
});