import { API_URL } from "./api.js";
import { storage } from "./storage.js";
import { escapeHtml } from "./utils.js";

const THEME_STORAGE_KEY = "theme";

function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;

    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function applyTheme(theme) {
    const normalized = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", normalized);
    localStorage.setItem(THEME_STORAGE_KEY, normalized);

    const btn = document.getElementById("theme-toggle-btn");
    if (!btn) return;

    const isDark = normalized === "dark";
    btn.setAttribute("aria-pressed", String(isDark));
    btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    btn.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
    btn.textContent = isDark ? "☀️" : "🌙";
}

function initTheme() {
    applyTheme(getPreferredTheme());
}

export async function injectSharedLayout() {
    const headerSlot = document.getElementById("site-header");
    const footerSlot = document.getElementById("site-footer");
    const requests = [];

    if (headerSlot) {
        requests.push(
            fetch("components/header.html")
                .then((res) => (res.ok ? res.text() : ""))
                .then((html) => {
                    if (html) headerSlot.innerHTML = html;
                })
                .catch(() => {})
        );
    }

    if (footerSlot) {
        requests.push(
            fetch("components/footer.html")
                .then((res) => (res.ok ? res.text() : ""))
                .then((html) => {
                    if (html) footerSlot.innerHTML = html;
                })
                .catch(() => {})
        );
    }

    await Promise.all(requests);
}

export async function loadNotifications() {
    const userId = storage.getUserId();
    if (!userId) return;

    try {
        const res = await fetch(`${API_URL}/notifications?userId=${userId}`);
        const notifs = res.ok ? await res.json() : [];
        const list = document.getElementById("notif-list");
        const badge = document.getElementById("notif-badge");
        if (!list || !badge || !Array.isArray(notifs)) return;

        if (notifs.length === 0) {
            list.innerHTML = '<li><span class="dropdown-item text-muted">No notifications</span></li>';
            badge.classList.add("d-none");
            return;
        }

        badge.textContent = String(notifs.length);
        badge.classList.remove("d-none");

        list.innerHTML = notifs
            .map(
                (n) => `
                <li class="dropdown-item border-bottom d-flex justify-content-between align-items-start px-3 py-2 text-wrap position-relative">
                    <a href="model.html?id=${n.itemId}" class="text-decoration-none text-dark flex-grow-1 me-3">
                        <small><strong>${escapeHtml(n.actorName)}</strong> ${n.type === "reply" ? "replied to your comment" : "commented on your item"}.</small>
                    </a>
                    <button class="btn btn-sm text-danger p-0 ms-2 delete-notif-btn" data-id="${n.id}" aria-label="Delete notification" title="Delete notification" style="z-index: 10;">&times;</button>
                </li>
            `
            )
            .join("");
    } catch (e) {
        console.error("Failed to load notifications", e);
    }
}

export function updateAuthNav() {
    const authNav = document.getElementById("auth-nav");
    if (!authNav) return;

    if (storage.getIsLoggedIn()) {
        authNav.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <div class="dropdown position-relative">
                    <button class="btn btn-outline-light position-relative" type="button" id="notifDropdown" aria-expanded="false" aria-controls="notif-list" aria-haspopup="true" aria-label="Notifications">
                        🔔 <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none" id="notif-badge" style="font-size: 0.65rem;">0</span>
                    </button>
                    <ul class="dropdown-menu shadow position-absolute" id="notif-list" role="menu" aria-label="Notifications" style="width: 300px; max-height: 400px; overflow-y: auto; right: 0; left: auto; top: 100%;">
                        <li><span class="dropdown-item text-muted">Loading...</span></li>
                    </ul>
                </div>
                <a href="profile.html" class="btn btn-outline-light">Profile</a>
                <button type="button" id="logout-btn" class="btn btn-danger btn-sm">Log out</button>
            </div>
        `;
        loadNotifications();
        return;
    }

    authNav.innerHTML = `
        <a href="login.html" class="btn btn-outline-light me-2">Log in</a>
        <a href="register.html" class="btn btn-primary">Sign up</a>
    `;
}

export function bindHeaderInteractions({ onLogout } = {}) {
    document.addEventListener("click", async (e) => {
        if (e.target.id === "theme-toggle-btn") {
            const current = document.documentElement.getAttribute("data-theme") || "light";
            applyTheme(current === "dark" ? "light" : "dark");
        }

        const notifDropdown = e.target.closest("#notifDropdown");
        const notifMenu = document.getElementById("notif-list");

        if (notifDropdown && notifMenu) {
            const nextState = !notifMenu.classList.contains("show");
            notifMenu.classList.toggle("show", nextState);
            notifDropdown.setAttribute("aria-expanded", String(nextState));
        } else if (notifMenu && !e.target.closest(".dropdown")) {
            notifMenu.classList.remove("show");
            const notifBtn = document.getElementById("notifDropdown");
            if (notifBtn) notifBtn.setAttribute("aria-expanded", "false");
        }

        if (e.target.classList.contains("delete-notif-btn")) {
            e.preventDefault();
            e.stopPropagation();
            const id = e.target.getAttribute("data-id");
            await fetch(`${API_URL}/notifications/${id}`, { method: "DELETE" });
            loadNotifications();
        }

        if (e.target.id === "logout-btn") {
            if (!window.confirm("Are you sure you want to log out?")) return;
            storage.setIsLoggedIn(false);
            updateAuthNav();
            if (typeof onLogout === "function") onLogout();
        }
    });
}

export async function initSharedPage(options = {}) {
    initTheme();
    await injectSharedLayout();
    initTheme();
    updateAuthNav();
    bindHeaderInteractions(options);
}
