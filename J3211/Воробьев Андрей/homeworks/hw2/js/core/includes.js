import { bindLogout, guardRoute } from "./auth.js";

async function includeHTML(selector, url) {
    const element = document.querySelector(selector);

    try {
        const response = await fetch(url);
        element.innerHTML = await response.text();
    } catch (error) {
        console.warn("Include error:", error);
    }
}

function setupPostLoginNavbar() {
    const user = JSON.parse(localStorage.user);
    const emailSpan = document.querySelector("#userEmail");
    emailSpan.textContent = user.email;

    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");

    document.querySelectorAll("[data-page]").forEach(link => {
        const isCurrent = link.getAttribute("data-page") === currentPage;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (!guardRoute()) return;

    if (localStorage.accessToken) {
        includeHTML("#postlogin-site-navbar", "fragments/postlogin_navbar.html").then(() => {
            setupPostLoginNavbar();
            bindLogout();
        });
    } else {
        includeHTML("#prelogin-site-navbar", "fragments/prelogin_navbar.html");
    }

    includeHTML("#site-footer", "fragments/footer.html");
});
