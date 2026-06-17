import { API_URL, fetchAllItems } from "../core/api.js";
import { initSharedPage } from "../core/layout.js";
import { storage } from "../core/storage.js";
import { escapeHtml } from "../core/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    await initSharedPage();

    const catalogContainer = document.getElementById("catalog-container");
    if (!catalogContainer) return;

    function isSubscribed(itemId) {
        return storage.getSubscriptions().includes(String(itemId));
    }

    function toggleSubscription(itemId) {
        const current = storage.getSubscriptions();
        const strId = String(itemId);
        const idx = current.indexOf(strId);
        if (idx >= 0) {
            current.splice(idx, 1);
        } else {
            current.push(strId);
        }
        storage.setSubscriptions(current);
        return current;
    }

    function handleSubscribeClick(itemId) {
        if (!storage.getIsLoggedIn()) {
            window.location.href = "login.html";
            return;
        }
        toggleSubscription(itemId);
    }

    function setSubscribeButtonState(button, subscribed) {
        if (!button) return;
        button.textContent = subscribed ? "Unsubscribe" : "Subscribe";
        button.classList.toggle("btn-outline-primary", !subscribed);
        button.classList.toggle("btn-outline-danger", subscribed);
    }

    function renderCards(data) {
        if (data.length === 0) {
            catalogContainer.innerHTML = "<p>No matches found.</p>";
            return;
        }

        catalogContainer.innerHTML = data
            .map((item) => {
                const typeBadge = item.type === "model" ? "bg-primary" : "bg-success";
                const subscribed = isSubscribed(item.id);
                const isStarred = storage.getStarred().includes(String(item.id));

                const btnSubText = subscribed ? "Unsubscribe" : "Subscribe";
                const btnSubClass = subscribed ? "btn-outline-danger" : "btn-outline-primary";
                const btnStarClass = isStarred ? "btn-warning" : "btn-outline-warning";

                return `
                    <div class="item-card">
                        <div class="d-flex justify-content-between align-items-start">
                            <h3><a href="model.html?id=${item.id}" class="text-decoration-none text-dark">${escapeHtml(item.name)}</a></h3>
                            <span class="badge ${typeBadge}">${escapeHtml(item.type.toUpperCase())}</span>
                        </div>
                        <p class="text-muted small mb-2">Task: ${escapeHtml(item.task.toUpperCase())} | License: ${escapeHtml(item.license.toUpperCase())} | Size: ${escapeHtml(item.size)}</p>
                        <p>${escapeHtml(item.desc)}</p>
                        <div class="d-flex gap-2">
                            <span class="badge bg-secondary">Downloads: ${escapeHtml(String(item.downloads))}</span>
                        </div>
                        <div class="mt-3 d-flex gap-2">
                            <button class="btn ${btnStarClass} btn-sm star-btn" data-star-id="${item.id}" data-stars="${item.stars}">★ ${item.stars}</button>
                            <button class="btn ${btnSubClass} btn-sm subscribe-btn" data-subscribe-id="${item.id}">${btnSubText}</button>
                        </div>
                    </div>
                `;
            })
            .join("");
    }

    catalogContainer.innerHTML = '<div class="text-center my-5"><p>Loading data from API...</p></div>';
    renderCards(await fetchAllItems());

    const applyBtn = document.getElementById("apply-filters");
    if (applyBtn) {
        applyBtn.addEventListener("click", async () => {
            catalogContainer.innerHTML = '<div class="text-center my-5"><p>Loading...</p></div>';

            const typeVal = document.getElementById("filter-type").value;
            const taskVal = document.getElementById("filter-task").value;
            const licVal = document.getElementById("filter-license").value;
            const searchVal = document.getElementById("searchInput").value.toLowerCase();

            const filtered = (await fetchAllItems()).filter((item) => {
                const matchType = typeVal === "all" || item.type === typeVal;
                const matchTask = taskVal === "all" || item.task === taskVal;
                const matchLic = licVal === "all" || item.license === licVal;
                const matchSearch = item.name.toLowerCase().includes(searchVal);
                return matchType && matchTask && matchLic && matchSearch;
            });

            renderCards(filtered);
        });
    }

    catalogContainer.addEventListener("click", async (e) => {
        const subBtn = e.target.closest(".subscribe-btn");
        if (subBtn) {
            const id = subBtn.getAttribute("data-subscribe-id");
            if (!id) return;
            handleSubscribeClick(id);
            setSubscribeButtonState(subBtn, isSubscribed(id));
            return;
        }

        const starBtn = e.target.closest(".star-btn");
        if (!starBtn) return;
        if (!storage.getIsLoggedIn()) {
            window.location.href = "login.html";
            return;
        }

        const id = starBtn.getAttribute("data-star-id");
        let currentStars = parseInt(starBtn.getAttribute("data-stars"), 10) || 0;

        const starred = storage.getStarred();
        const currentlyStarred = starred.includes(id);
        const newStarsCount = currentlyStarred ? currentStars - 1 : currentStars + 1;

        try {
            await fetch(`${API_URL}/items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stars: newStarsCount })
            });

            if (currentlyStarred) {
                storage.setStarred(starred.filter((sid) => sid !== id));
                starBtn.classList.replace("btn-warning", "btn-outline-warning");
            } else {
                starred.push(id);
                storage.setStarred(starred);
                starBtn.classList.replace("btn-outline-warning", "btn-warning");
            }

            currentStars = newStarsCount;
            starBtn.setAttribute("data-stars", String(currentStars));
            starBtn.textContent = `★ ${currentStars}`;
        } catch (err) {
            console.error("Failed to star", err);
        }
    });
});
