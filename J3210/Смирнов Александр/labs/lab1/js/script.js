document.addEventListener("DOMContentLoaded", function() {
    // Main entry: initialize UI, state and event handlers
    const catalogContainer = document.getElementById("catalog-container");
    const authNav = document.getElementById("auth-nav");

    // Local storage helpers
    const storage = {
        getIsLoggedIn() {
            return localStorage.getItem("isLoggedIn") === "true";
        },
        setIsLoggedIn(value) {
            localStorage.setItem("isLoggedIn", value ? "true" : "false");
        },
        getSubscriptions() {
            try {
                const raw = localStorage.getItem("subscriptions");
                const parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        },
        setSubscriptions(list) {
            localStorage.setItem("subscriptions", JSON.stringify(list));
        },
        getUserName() {
            return localStorage.getItem("userName") || "";
        },
        setUserName(name) {
            localStorage.setItem("userName", name);
        }
    };

    // Escape user-provided text to prevent XSS when inserting into DOM
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Compute initials used in profile avatar
    function getInitials(name) {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return "";
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    // Update navigation area based on login state
    function updateAuthNav() {
        if (!authNav) return;
        if (storage.getIsLoggedIn()) {
            authNav.innerHTML = `
                <a href="profile.html" class="btn btn-outline-light">Profile</a>
            `;
        } else {
            authNav.innerHTML = `
                <a href="login.html" class="btn btn-outline-light me-2">Log in</a>
                <a href="register.html" class="btn btn-primary">Sign up</a>
            `;
        }
    }

    // Subscriptions helpers
    function isSubscribed(itemId) {
        return storage.getSubscriptions().includes(itemId);
    }

    function toggleSubscription(itemId) {
        const current = storage.getSubscriptions();
        const idx = current.indexOf(itemId);
        if (idx >= 0) {
            current.splice(idx, 1);
        } else {
            current.push(itemId);
        }
        storage.setSubscriptions(current);
        return current;
    }

    // Update subscribe button appearance and label
    function setSubscribeButtonState(button, subscribed) {
        if (!button) return;
        button.textContent = subscribed ? "Unsubscribe" : "Subscribe";
        button.classList.toggle("btn-outline-primary", !subscribed);
        button.classList.toggle("btn-outline-danger", subscribed);
    }

    // Render subscriptions list in profile page
    function renderProfileSubscriptions() {
        const list = document.getElementById("subscriptions-list");
        if (!list || typeof appData === "undefined") return;

        const ids = storage.getSubscriptions();
        const items = appData.filter(item => ids.includes(item.id));

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

    // Update profile name and initials in sidebar
    function updateProfileHeader() {
        const nameEl = document.getElementById("profile-name");
        const initialsEl = document.getElementById("profile-initials");
        if (!nameEl || !initialsEl) return;

        const stored = storage.getUserName();
        const name = stored.trim() ? stored : "Student User";
        nameEl.textContent = name;
        initialsEl.textContent = getInitials(name) || "SU";
    }

    // Centralized subscribe action with auth check
    function handleSubscribeClick(itemId) {
        if (!storage.getIsLoggedIn()) {
            window.location.href = "login.html";
            return;
        }
        toggleSubscription(itemId);
    }

    // Render catalog cards efficiently into the container
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

    // Render initial catalog (if present)
    if (catalogContainer && typeof appData !== 'undefined') {
        renderCards(appData);
    }

    // Filtering logic
    const applyBtn = document.getElementById("apply-filters");
    // Filter apply handler
    if (applyBtn) {
        applyBtn.addEventListener("click", () => {
            const typeVal = document.getElementById("filter-type").value;
            const taskVal = document.getElementById("filter-task").value;
            const licVal = document.getElementById("filter-license").value;
            const searchVal = document.getElementById("searchInput").value.toLowerCase();

            const filtered = appData.filter(item => {
                const matchType = typeVal === 'all' || item.type === typeVal;
                const matchTask = taskVal === 'all' || item.task === taskVal;
                const matchLic = licVal === 'all' || item.license === licVal;
                const matchSearch = item.name.toLowerCase().includes(searchVal);
                return matchType && matchTask && matchLic && matchSearch;
            });

            renderCards(filtered);
        });
    }

    // Load item details from URL and populate page
    const detailName = document.getElementById("detail-name");
    const detailSubscribeBtn = document.getElementById("btn-subscribe");
    
    if (detailName && typeof appData !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const itemId = parseInt(params.get('id'), 10);
        
        if (isNaN(itemId)) {
            detailName.textContent = "Invalid item ID";
        } else {
            const item = appData.find(x => x.id === itemId);
            
            if (item) {
                document.title = `${item.name} - AI Hub`;
                detailName.textContent = item.name;
                
                const typeBadge = document.getElementById("detail-type");
                typeBadge.textContent = item.type.toUpperCase();
                typeBadge.className = `badge ${item.type === 'model' ? 'bg-primary' : 'bg-success'}`;
                
                document.getElementById("detail-stars").textContent = `Star ${item.stars}`;
                document.getElementById("detail-forks").textContent = `Fork ${item.forks}`;
                
                document.getElementById("detail-desc").textContent = item.desc;
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

    // Post comment handler (client-side only)
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
    // Simulated login: set auth state in localStorage
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
    // Simulated register: set auth state in localStorage
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            storage.setIsLoggedIn(true);
            if (!storage.getUserName()) {
                storage.setUserName("Student User");
            }
            updateAuthNav();
            window.location.href = "profile.html";
        });
    }

    const editProfileBtn = document.getElementById("edit-profile-btn");
    const editNameInput = document.getElementById("edit-name-input");
    const saveProfileBtn = document.getElementById("save-profile-btn");

    // Edit profile modal handlers
    if (editProfileBtn && editNameInput) {
        editProfileBtn.addEventListener("click", () => {
            const current = storage.getUserName() || "Student User";
            editNameInput.value = current;
        });
    }

    if (saveProfileBtn && editNameInput) {
        saveProfileBtn.addEventListener("click", () => {
            const value = editNameInput.value.trim();
            const name = value || "Student User";
            storage.setUserName(name);
            updateProfileHeader();
        });
    }

    // Delegate subscribe button clicks in catalog to central handler
    if (catalogContainer) {
        catalogContainer.addEventListener("click", (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;
            const button = target.closest(".subscribe-btn");
            if (!button) return;
            const id = parseInt(button.getAttribute("data-subscribe-id"), 10);
            if (Number.isNaN(id)) return;

            handleSubscribeClick(id);
            setSubscribeButtonState(button, isSubscribed(id));
        });
    }

    // Subscribe button on detail page
    if (detailSubscribeBtn) {
        detailSubscribeBtn.addEventListener("click", () => {
            const id = parseInt(detailSubscribeBtn.dataset.subscribeId, 10);
            if (Number.isNaN(id)) return;

            handleSubscribeClick(id);
            setSubscribeButtonState(detailSubscribeBtn, isSubscribed(id));
        });
    }

    // Initial UI sync
    updateAuthNav();
    renderProfileSubscriptions();
    updateProfileHeader();
});