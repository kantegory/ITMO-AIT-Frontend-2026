import { API_URL, fetchAllItems } from "../core/api.js";
import { initSharedPage } from "../core/layout.js";
import { storage } from "../core/storage.js";
import { escapeHtml, getInitials } from "../core/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    if (!storage.getIsLoggedIn()) {
        window.location.href = "login.html";
        return;
    }

    await initSharedPage({
        onLogout: () => {
            if (window.location.pathname.endsWith("profile.html")) {
                window.location.href = "index.html";
            }
        }
    });

    function updateProfileHeader() {
        const nameEl = document.getElementById("profile-name");
        const initialsEl = document.getElementById("profile-initials");
        const emailEl = document.getElementById("profile-email");
        if (!nameEl || !initialsEl) return;

        const name = storage.getUserName() || "Student User";
        nameEl.textContent = name;
        initialsEl.textContent = getInitials(name) || "SU";

        if (emailEl) {
            emailEl.textContent = storage.getUserEmail() || "student@itmo.ru";
        }
    }

    async function renderProfileSubscriptions() {
        const list = document.getElementById("subscriptions-list");
        if (!list) return;

        const ids = storage.getSubscriptions();
        const items = (await fetchAllItems()).filter((item) => ids.includes(String(item.id)));

        if (items.length === 0) {
            list.innerHTML = '<p class="text-muted">No subscriptions yet.</p>';
            return;
        }

        list.innerHTML = items
            .map((item) => {
                const typeBadge = item.type === "model" ? "bg-primary" : "bg-success";
                return `
                    <a href="model.html?id=${item.id}" class="text-decoration-none text-dark">
                        <div class="item-card">
                            <div class="d-flex justify-content-between">
                                <h5>${escapeHtml(item.name)}</h5>
                                <span class="badge ${typeBadge}">${escapeHtml(item.type.toUpperCase())}</span>
                            </div>
                            <p class="text-muted small">You will receive notifications about new versions and discussions.</p>
                        </div>
                    </a>
                `;
            })
            .join("");
    }

    async function renderProfileUploads() {
        const list = document.getElementById("my-uploads-list");
        if (!list) return;

        const items = (await fetchAllItems()).filter((item) => item.authorId === storage.getUserId());

        if (items.length === 0) {
            list.innerHTML = '<p class="text-muted">You have not uploaded any models or datasets yet.</p>';
            return;
        }

        list.innerHTML = items
            .map((item) => {
                const typeBadge = item.type === "model" ? "bg-primary" : "bg-success";
                return `
                    <a href="model.html?id=${item.id}" class="text-decoration-none text-dark">
                        <div class="item-card">
                            <div class="d-flex justify-content-between align-items-start">
                                <h5>${escapeHtml(item.name)}</h5>
                                <span class="badge ${typeBadge}">${escapeHtml(item.type.toUpperCase())}</span>
                            </div>
                            <p class="text-muted small mb-2">Task: ${escapeHtml(item.task.toUpperCase())} | License: ${escapeHtml(item.license.toUpperCase())} | Size: ${escapeHtml(item.size)}</p>
                            <p class="mb-0">${escapeHtml(item.desc)}</p>
                        </div>
                    </a>
                `;
            })
            .join("");
    }

    const uploadForm = document.getElementById("upload-form");
    if (uploadForm) {
        uploadForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const type = document.getElementById("upload-type").value;
            const name = document.getElementById("upload-name").value.trim();
            const task = document.getElementById("upload-task").value;
            const framework = document.getElementById("upload-framework").value.trim() || "none";
            const license = document.getElementById("upload-license").value;
            const shortDesc = document.getElementById("upload-short-desc").value.trim();
            const fullDesc = document.getElementById("upload-full-desc").value.trim();
            const fileInput = document.getElementById("upload-file");
            const file = fileInput && fileInput.files ? fileInput.files[0] : null;
            const metrics = document.getElementById("upload-metrics").value.trim();
            const usage = document.getElementById("upload-usage").value.trim();

            const newItem = {
                id: String(Date.now()),
                authorId: storage.getUserId(),
                type,
                name,
                task,
                license,
                framework: framework.toLowerCase(),
                size: file ? `${(file.size / (1024 * 1024)).toFixed(2)}mb` : "n/a",
                downloads: "0",
                stars: 0,
                metrics,
                desc: shortDesc,
                fullDesc,
                usage
            };

            try {
                await fetch(`${API_URL}/items`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newItem)
                });
                uploadForm.reset();
                renderProfileUploads();
            } catch (err) {
                console.error("Upload failed", err);
            }
        });
    }

    const editProfileBtn = document.getElementById("edit-profile-btn");
    const editNameInput = document.getElementById("edit-name-input");
    const saveProfileBtn = document.getElementById("save-profile-btn");

    if (editProfileBtn && editNameInput) {
        editProfileBtn.addEventListener("click", () => {
            editNameInput.value = storage.getUserName() || "Student User";
        });
    }

    if (saveProfileBtn && editNameInput) {
        saveProfileBtn.addEventListener("click", () => {
            storage.setUserName(editNameInput.value.trim() || "Student User");
            updateProfileHeader();
        });
    }

    updateProfileHeader();
    await renderProfileSubscriptions();
    await renderProfileUploads();
});
