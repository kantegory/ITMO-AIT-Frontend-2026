document.addEventListener("DOMContentLoaded", async function() {
    const catalogContainer = document.getElementById("catalog-container");
    const API_URL = 'http://localhost:3000';

    async function injectSharedLayout() {
        const headerSlot = document.getElementById("site-header");
        const footerSlot = document.getElementById("site-footer");
        const requests =[];

        if (headerSlot) {
            requests.push(fetch("components/header.html").then(res => res.ok ? res.text() : "").then(html => {
                if (html) headerSlot.innerHTML = html;
            }).catch(() => {}));
        }

        if (footerSlot) {
            requests.push(fetch("components/footer.html").then(res => res.ok ? res.text() : "").then(html => {
                if (html) footerSlot.innerHTML = html;
            }).catch(() => {}));
        }

        await Promise.all(requests);
    }
    await injectSharedLayout();

    // Local storage helpers
    const storage = {
        getIsLoggedIn: () => localStorage.getItem("isLoggedIn") === "true",
        setIsLoggedIn: (value) => localStorage.setItem("isLoggedIn", value ? "true" : "false"),
        getSubscriptions: () => {
            try { return JSON.parse(localStorage.getItem("subscriptions")) ||[]; } catch { return[]; }
        },
        setSubscriptions: (list) => localStorage.setItem("subscriptions", JSON.stringify(list)),
        getUserName: () => localStorage.getItem("userName") || "",
        setUserName: (name) => localStorage.setItem("userName", name),
        getUserUploads: () => {
            try { return JSON.parse(localStorage.getItem("userUploads")) || []; } catch { return[]; }
        },
        setUserUploads: (list) => localStorage.setItem("userUploads", JSON.stringify(list))
    };

    async function fetchAllItems() {
        try {
            const response = await fetch(`${API_URL}/items`);
            if (!response.ok) throw new Error('Network error');
            const apiItems = await response.json();
            
            const uploads = storage.getUserUploads();
            return [...apiItems, ...uploads];
        } catch (error) {
            console.error("Failed to fetch API data:", error);
            return storage.getUserUploads();
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getInitials(name) {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return "";
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function updateAuthNav() {
        const authNav = document.getElementById("auth-nav");
        if (!authNav) return;
        if (storage.getIsLoggedIn()) {
            authNav.innerHTML = `
                <a href="profile.html" class="btn btn-outline-light me-2">Profile</a>
                <button type="button" id="logout-btn" class="btn btn-danger btn-sm">Log out</button>
            `;
        } else {
            authNav.innerHTML = `
                <a href="login.html" class="btn btn-outline-light me-2">Log in</a>
                <a href="register.html" class="btn btn-primary">Sign up</a>
            `;
        }
    }

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

    function setSubscribeButtonState(button, subscribed) {
        if (!button) return;
        button.textContent = subscribed ? "Unsubscribe" : "Subscribe";
        button.classList.toggle("btn-outline-primary", !subscribed);
        button.classList.toggle("btn-outline-danger", subscribed);
    }

    async function renderProfileSubscriptions() {
        const list = document.getElementById("subscriptions-list");
        if (!list) return;

        const ids = storage.getSubscriptions();
        const allItems = await fetchAllItems();
        const items = allItems.filter(item => ids.includes(String(item.id)));

        if (items.length === 0) {
            list.innerHTML = "<p class=\"text-muted\">No subscriptions yet.</p>";
            return;
        }

        list.innerHTML = items.map(item => {
            const typeBadge = item.type === 'model' ? 'bg-primary' : 'bg-success';
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
        }).join("");
    }

    function renderProfileUploads() {
        const list = document.getElementById("my-uploads-list");
        if (!list) return;

        const items = storage.getUserUploads();
        if (items.length === 0) {
            list.innerHTML = "<p class=\"text-muted\">You have not uploaded any models or datasets yet.</p>";
            return;
        }

        list.innerHTML = items.map(item => {
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
        }).join("");
    }

    function updateProfileHeader() {
        const nameEl = document.getElementById("profile-name");
        const initialsEl = document.getElementById("profile-initials");
        if (!nameEl || !initialsEl) return;

        const stored = storage.getUserName();
        const name = stored.trim() ? stored : "Student User";
        nameEl.textContent = name;
        initialsEl.textContent = getInitials(name) || "SU";
    }

    function handleSubscribeClick(itemId) {
        if (!storage.getIsLoggedIn()) {
            window.location.href = "login.html";
            return;
        }
        toggleSubscription(itemId);
    }

    function renderCards(data) {
        if (!catalogContainer) return;
        
        if (data.length === 0) {
            catalogContainer.innerHTML = "<p>No matches found.</p>";
            return;
        }

        const cardsHtml = data.map(item => {
            const typeBadge = item.type === 'model' ? 'bg-primary' : 'bg-success';
            const subscribed = isSubscribed(item.id);
            const buttonText = subscribed ? "Unsubscribe" : "Subscribe";
            const buttonClass = subscribed ? "btn-outline-danger" : "btn-outline-primary";
            return `
                <div class="item-card">
                    <div class="d-flex justify-content-between align-items-start">
                        <h3><a href="model.html?id=${item.id}" class="text-decoration-none text-dark">${escapeHtml(item.name)}</a></h3>
                        <span class="badge ${typeBadge}">${escapeHtml(item.type.toUpperCase())}</span>
                    </div>
                    <p class="text-muted small mb-2">Task: ${escapeHtml(item.task.toUpperCase())} | License: ${escapeHtml(item.license.toUpperCase())} | Size: ${escapeHtml(item.size)}</p>
                    <p>${escapeHtml(item.desc)}</p>
                    <div class="d-flex gap-2">
                        <span class="badge bg-secondary">Downloads: ${escapeHtml(item.downloads)}</span>
                        <span class="badge bg-warning text-dark">Stars: ${item.stars}</span>
                    </div>
                    <div class="mt-3">
                        <button class="btn ${buttonClass} btn-sm subscribe-btn" data-subscribe-id="${item.id}">${buttonText}</button>
                    </div>
                </div>
            `;
        }).join("");
        
        catalogContainer.innerHTML = cardsHtml;
    }

    if (catalogContainer) {
        catalogContainer.innerHTML = '<div class="text-center my-5"><p>Loading data from API...</p></div>';
        const initialItems = await fetchAllItems();
        renderCards(initialItems);
    }

    const applyBtn = document.getElementById("apply-filters");
    if (applyBtn) {
        applyBtn.addEventListener("click", async () => {
            catalogContainer.innerHTML = '<div class="text-center my-5"><p>Loading...</p></div>';
            
            const typeVal = document.getElementById("filter-type").value;
            const taskVal = document.getElementById("filter-task").value;
            const licVal = document.getElementById("filter-license").value;
            const searchVal = document.getElementById("searchInput").value.toLowerCase();

            const allItems = await fetchAllItems();

            const filtered = allItems.filter(item => {
                const matchType = typeVal === 'all' || item.type === typeVal;
                const matchTask = taskVal === 'all' || item.task === taskVal;
                const matchLic = licVal === 'all' || item.license === licVal;
                const matchSearch = item.name.toLowerCase().includes(searchVal);
                return matchType && matchTask && matchLic && matchSearch;
            });

            renderCards(filtered);
        });
    }

    const detailName = document.getElementById("detail-name");
    const detailSubscribeBtn = document.getElementById("btn-subscribe");
    
    if (detailName) {
        const params = new URLSearchParams(window.location.search);
        const itemId = params.get('id');
        
        if (!itemId) {
            detailName.textContent = "Invalid item ID";
        } else {
            const allItems = await fetchAllItems();
            const item = allItems.find(x => String(x.id) === String(itemId));
            
            if (item) {
                document.title = `${item.name} - AI Hub`;
                detailName.textContent = item.name;
                
                const typeBadge = document.getElementById("detail-type");
                typeBadge.textContent = item.type.toUpperCase();
                typeBadge.className = `badge ${item.type === 'model' ? 'bg-primary' : 'bg-success'}`;
                
                document.getElementById("detail-stars").textContent = `Star ${item.stars}`;
                document.getElementById("detail-forks").textContent = `Fork ${item.forks}`;
                
                document.getElementById("detail-desc").textContent = item.fullDesc || item.desc;
                document.getElementById("detail-usage").textContent = item.usage;
                
                document.getElementById("detail-lic").textContent = item.license.toUpperCase();
                document.getElementById("detail-size").textContent = item.size;
                document.getElementById("detail-task").textContent = item.task.toUpperCase();
                document.getElementById("detail-fw").textContent = item.framework.toUpperCase();
                document.getElementById("detail-metrics").textContent = item.metrics;
                document.getElementById("detail-dl").textContent = item.downloads;

                if (detailSubscribeBtn) {
                    detailSubscribeBtn.style.display = "inline-block";
                    detailSubscribeBtn.dataset.subscribeId = String(item.id);
                    setSubscribeButtonState(detailSubscribeBtn, isSubscribed(item.id));
                }
            } else {
                detailName.textContent = "Item not found";
            }
        }
    }

    const postBtn = document.getElementById("post-comment-btn");
    const commentInput = document.getElementById("comment-input");
    const commentsList = document.getElementById("comments-list");

    if (postBtn && commentInput && commentsList) {
        postBtn.addEventListener("click", () => {
            const text = commentInput.value.trim();
            if (text) {
                const commentHtml = `
                    <div class="mb-3 border-bottom pb-2">
                        <strong>You:</strong> 
                        <p class="mb-1 text-muted small">${escapeHtml(text)}</p>
                    </div>
                `;
                commentsList.insertAdjacentHTML('beforeend', commentHtml);
                commentInput.value = "";
            }
        });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            storage.setIsLoggedIn(true);
            if (!storage.getUserName()) {
                storage.setUserName("Student User");
            }
            updateAuthNav();
            window.location.href = "profile.html";
        });
    }

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById("register-username");
            const username = usernameInput ? usernameInput.value.trim() : "";
            storage.setIsLoggedIn(true);
            storage.setUserName(username || "Student User");
            updateAuthNav();
            window.location.href = "profile.html";
        });
    }

    const uploadForm = document.getElementById("upload-form");
    if (uploadForm) {
        uploadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!storage.getIsLoggedIn()) {
                window.location.href = "login.html";
                return;
            }

            const type = document.getElementById("upload-type").value;
            const name = document.getElementById("upload-name").value.trim();
            const task = document.getElementById("upload-task").value;
            const framework = document.getElementById("upload-framework").value.trim() || "none";
            const license = document.getElementById("upload-license").value;
            const shortDesc = document.getElementById("upload-short-desc").value.trim();
            const fullDesc = document.getElementById("upload-full-desc").value.trim();
            const fileInput = document.getElementById("upload-file");
            const file = fileInput && fileInput.files ? fileInput.files[0] : null;

            const size = file ? `${(file.size / (1024 * 1024)).toFixed(2)}mb` : "n/a";
            const usage = file ? `User file: ${file.name}` : "User uploaded item";

            const newItem = {
                id: String(Date.now()),
                type,
                name,
                task,
                framework: framework.toLowerCase(),
                license,
                size,
                downloads: "0",
                stars: 0,
                forks: 0,
                metrics: "No metrics yet",
                desc: shortDesc,
                fullDesc,
                usage
            };

            const uploads = storage.getUserUploads();
            uploads.unshift(newItem);
            storage.setUserUploads(uploads);

            uploadForm.reset();
            renderProfileUploads();
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

    if (catalogContainer) {
        catalogContainer.addEventListener("click", (e) => {
            const button = e.target.closest(".subscribe-btn");
            if (!button) return;
            const id = button.getAttribute("data-subscribe-id");
            if (!id) return;

            handleSubscribeClick(id);
            setSubscribeButtonState(button, isSubscribed(id));
        });
    }

    if (detailSubscribeBtn) {
        detailSubscribeBtn.addEventListener("click", () => {
            const id = detailSubscribeBtn.dataset.subscribeId;
            if (!id) return;

            handleSubscribeClick(id);
            setSubscribeButtonState(detailSubscribeBtn, isSubscribed(id));
        });
    }

    document.addEventListener("click", (e) => {
        if (e.target.id !== "logout-btn") return;
        if (!window.confirm("Are you sure you want to log out?")) return;

        storage.setIsLoggedIn(false);
        updateAuthNav();

        if (window.location.pathname.endsWith("profile.html")) {
            window.location.href = "index.html";
        }
    });

    if (window.location.pathname.endsWith("profile.html") && !storage.getIsLoggedIn()) {
        window.location.href = "login.html";
        return;
    }

    updateAuthNav();
    await renderProfileSubscriptions();
    updateProfileHeader();
    renderProfileUploads();
});