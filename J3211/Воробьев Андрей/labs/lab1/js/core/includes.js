async function includeHTML(selector, url) {
    const element = document.querySelector(selector);
    if (!element) return;

    try {
        const response = await fetch(url);
        element.innerHTML = await response.text();
    } catch (error) {
        console.warn("Include error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    includeHTML("#prelogin-site-navbar", "fragments/prelogin_navbar.html");
    includeHTML("#site-footer", "fragments/footer.html");

});