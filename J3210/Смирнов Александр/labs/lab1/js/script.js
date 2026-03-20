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

    const storage = {
        getIsLoggedIn: () => localStorage.getItem("isLoggedIn") === "true",
        setIsLoggedIn: (value) => localStorage.setItem("isLoggedIn", value ? "true" : "false"),
        getUserId: () => localStorage.getItem("userId") || "",
        setUserId: (id) => localStorage.setItem("userId", id),
        getUserName: () => localStorage.getItem("userName") || "",
        setUserName: (name) => localStorage.setItem("userName", name),
        getUserEmail: () => localStorage.getItem("userEmail") || "",
        setUserEmail: (email) => localStorage.setItem("userEmail", email),
        getSubscriptions: () => {
            try { return JSON.parse(localStorage.getItem("subscriptions")) || []; } catch { return []; }
        },
        setSubscriptions: (list) => localStorage.setItem("subscriptions", JSON.stringify(list)),
        getStarred: () => {
            try { return JSON.parse(localStorage.getItem("starred")) || []; } catch { return []; }
        },
        setStarred: (list) => localStorage.setItem("starred", JSON.stringify(list))
    };

    async function fetchAllItems() {
        try {
            const response = await fetch(`${API_URL}/items`);
            if (!response.ok) throw new Error('Network error');
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch API data:", error);
            return [];
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function parseDownloads(str) {
        if (!str) return 0;
        str = String(str).toUpperCase();
        if (str.endsWith('K')) return parseFloat(str) * 1000;
        if (str.endsWith('M')) return parseFloat(str) * 1000000;
        return parseInt(str) || 0;
    }

    function formatDownloads(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
        return String(num);
    }

    function getInitials(name) {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return "";
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    async function loadNotifications() {
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
                badge.classList.add('d-none');
                return;
            }

            badge.textContent = notifs.length;
            badge.classList.remove('d-none');

            list.innerHTML = notifs.map(n => `
                <li class="dropdown-item border-bottom d-flex justify-content-between align-items-start px-3 py-2 text-wrap position-relative">
                    <a href="model.html?id=${n.itemId}" class="text-decoration-none text-dark flex-grow-1 me-3">
                        <small><strong>${escapeHtml(n.actorName)}</strong> ${n.type === 'reply' ? 'replied to your comment' : 'commented on your item'}.</small>
                    </a>
                    <button class="btn btn-sm text-danger p-0 ms-2 delete-notif-btn" data-id="${n.id}" style="z-index: 10;">&times;</button>
                </li>
            `).join("");
        } catch (e) { console.error("Failed to load notifications", e); }
    }

    function updateAuthNav() {
        const authNav = document.getElementById("auth-nav");
        if (!authNav) return;
        if (storage.getIsLoggedIn()) {
            authNav.innerHTML = `
                <div class="d-flex align-items-center gap-3">
                    <div class="dropdown position-relative">
                        <button class="btn btn-outline-light position-relative" type="button" id="notifDropdown">
                            🔔 <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none" id="notif-badge" style="font-size: 0.65rem;">0</span>
                        </button>
                        <ul class="dropdown-menu shadow position-absolute" id="notif-list" style="width: 300px; max-height: 400px; overflow-y: auto; right: 0; left: auto; top: 100%;">
                            <li><span class="dropdown-item text-muted">Loading...</span></li>
                        </ul>
                    </div>
                    <a href="profile.html" class="btn btn-outline-light">Profile</a>
                    <button type="button" id="logout-btn" class="btn btn-danger btn-sm">Log out</button>
                </div>
            `;
            loadNotifications();
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

    async function renderProfileUploads() {
        const list = document.getElementById("my-uploads-list");
        if (!list) return;

        const allItems = await fetchAllItems();
        const items = allItems.filter(item => item.authorId === storage.getUserId());
        
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
        const emailEl = document.getElementById("profile-email");
        if (!nameEl || !initialsEl) return;

        const name = storage.getUserName() || "Student User";
        nameEl.textContent = name;
        initialsEl.textContent = getInitials(name) || "SU";
        
        if (emailEl) {
            emailEl.textContent = storage.getUserEmail() || "student@itmo.ru";
        }
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
                
                const starBtn = document.getElementById("detail-stars");
                const isStarred = storage.getStarred().includes(String(item.id));
                starBtn.textContent = `★ ${item.stars}`;
                starBtn.className = `btn ${isStarred ? 'btn-warning' : 'btn-outline-warning'}`;
                
                starBtn.onclick = async () => {
                    if (!storage.getIsLoggedIn()) {
                        window.location.href = "login.html";
                        return;
                    }
                    const starred = storage.getStarred();
                    const currentlyStarred = starred.includes(String(item.id));
                    const newStarsCount = currentlyStarred ? item.stars - 1 : item.stars + 1;

                    try {
                        await fetch(`${API_URL}/items/${item.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ stars: newStarsCount })
                        });

                        item.stars = newStarsCount;
                        if (currentlyStarred) {
                            storage.setStarred(starred.filter(id => id !== String(item.id)));
                            starBtn.className = "btn btn-outline-warning";
                        } else {
                            starred.push(String(item.id));
                            storage.setStarred(starred);
                            starBtn.className = "btn btn-warning";
                        }
                        starBtn.textContent = `★ ${newStarsCount}`;
                    } catch (err) { console.error(err); }
                };
                
                document.getElementById("detail-desc").textContent = item.fullDesc || item.desc;
                document.getElementById("detail-usage").textContent = item.usage;
                
                document.getElementById("detail-lic").textContent = item.license.toUpperCase();
                document.getElementById("detail-size").textContent = item.size;
                document.getElementById("detail-task").textContent = item.task.toUpperCase();
                document.getElementById("detail-fw").textContent = item.framework.toUpperCase();
                document.getElementById("detail-metrics").textContent = item.metrics;
                document.getElementById("detail-dl").textContent = item.downloads;

                // Находим родительскую кнопку для спана с загрузками
                const dlButton = document.getElementById("detail-dl").parentElement;
                
                dlButton.onclick = async () => {
                    // 1. Увеличиваем счетчик
                    let currentCount = parseDownloads(item.downloads);
                    currentCount++;
                    item.downloads = formatDownloads(currentCount);
                    
                    // Обновляем текст на кнопке
                    document.getElementById("detail-dl").textContent = item.downloads;

                    // 2. Генерируем фейковый файл для скачивания
                    const content = `=== AI Hub Download ===\nName: ${item.name}\nTask: ${item.task}\nFramework: ${item.framework}\nLicense: ${item.license}\n\nMetrics: ${item.metrics}\nUsage:\n${item.usage}\n`;
                    const blob = new Blob([content], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${item.name.replace(/\s+/g, '_')}_data.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    // 3. Отправляем обновленный счетчик на сервер
                    try {
                        await fetch(`${API_URL}/items/${item.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ downloads: item.downloads })
                        });
                    } catch (err) { console.error("Failed to update downloads", err); }
                };

                if (detailSubscribeBtn) {
                    detailSubscribeBtn.style.display = "inline-block";
                    detailSubscribeBtn.dataset.subscribeId = String(item.id);
                    setSubscribeButtonState(detailSubscribeBtn, isSubscribed(item.id));
                }

                await loadComments(item.id);
            } else {
                detailName.textContent = "Item not found";
            }
        }
    }

    async function loadComments(itemId) {
        if (!itemId) return;
        try {
            const res = await fetch(`${API_URL}/comments`);
            const comments = res.ok ? await res.json() : [];
            if (!Array.isArray(comments)) {
                renderComments([]);
                return;
            }

            const filtered = comments.filter(c => String(c.itemId) === String(itemId));
            renderComments(filtered);
        } catch (e) { console.error("Failed to load comments", e); }
    }

    function renderComments(comments) {
        const list = document.getElementById("comments-list");
        if (!list) return;

        if (!Array.isArray(comments) || comments.length === 0) {
            list.innerHTML = "<p class='text-muted small'>No comments yet. Be the first to start the discussion!</p>";
            return;
        }

        const childrenByParent = new Map();
        const rootComments = [];

        for (const c of comments) {
            const isRoot = c.parentId == null || c.parentId === '' || c.parentId === 'null' || c.parentId === 'undefined';
            if (isRoot) {
                rootComments.push(c);
                continue;
            }
            const pKey = String(c.parentId);
            if (!childrenByParent.has(pKey)) childrenByParent.set(pKey, []);
            childrenByParent.get(pKey).push(c);
        }

        if (rootComments.length === 0) {
            list.innerHTML = "<p class='text-muted small'>No comments yet. Be the first to start the discussion!</p>";
            return;
        }

        const renderNode = (comment, level = 0) => {
            const children = childrenByParent.get(String(comment.id)) || [];
            const leftMarginClass = level > 0 ? "ms-4" : "";

            return `
                <div class="${leftMarginClass} mb-3 border-bottom pb-2">
                    <div class="d-flex justify-content-between align-items-start gap-2">
                        <strong>${escapeHtml(comment.userName || "User")}</strong>
                        <button class="btn btn-sm btn-link p-0 text-secondary text-decoration-none reply-btn" data-parent-id="${comment.id}" data-parent-author="${escapeHtml(comment.userName || "User")}" title="Reply" aria-label="Reply">↪</button>
                    </div>
                    <p class="mb-1 text-muted small">${escapeHtml(comment.text)}</p>

                    <div class="mt-2 d-none reply-form" id="reply-form-${comment.id}">
                        <textarea class="form-control form-control-sm mb-1" id="reply-input-${comment.id}" rows="1" placeholder="Write a reply..."></textarea>
                        <button class="btn btn-primary btn-sm submit-reply-btn" data-parent-id="${comment.id}" data-parent-author="${escapeHtml(comment.userName || "User")}">Send</button>
                        <button class="btn btn-secondary btn-sm cancel-reply-btn" data-parent-id="${comment.id}">Cancel</button>
                    </div>

                    ${children.map(child => renderNode(child, level + 1)).join("")}
                </div>
            `;
        };

        list.innerHTML = rootComments.map(c => renderNode(c)).join("");
    }

    async function createComment(text, parentId = null) {
        if (!storage.getIsLoggedIn()) return window.location.href = "login.html";
        const params = new URLSearchParams(window.location.search);
        const itemId = params.get('id');
        const userId = storage.getUserId();
        const userName = storage.getUserName();

        try {
            const createRes = await fetch(`${API_URL}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: String(Date.now()), itemId, userId, userName, text, parentId })
            });
            if (!createRes.ok) throw new Error("Failed to save comment");

            const notificationsToSend = new Map();
            
            const itemRes = await fetch(`${API_URL}/items/${itemId}`);
            if (itemRes.ok) {
                const item = await itemRes.json();
                if (item.authorId && String(item.authorId) !== String(userId)) {
                    notificationsToSend.set(String(item.authorId), 'comment');
                }
            }

            if (parentId) {
                const parentRes = await fetch(`${API_URL}/comments/${parentId}`);
                if (parentRes.ok) {
                    const parentComment = await parentRes.json();
                    if (String(parentComment.userId) !== String(userId)) {
                        notificationsToSend.set(String(parentComment.userId), 'reply');
                    }
                }
            }

            for (const [targetUserId, notificationType] of notificationsToSend.entries()) {
                const notifRes = await fetch(`${API_URL}/notifications`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: `${Date.now()}-${Math.random()}`, 
                        userId: targetUserId, 
                        actorName: userName, 
                        type: notificationType, 
                        itemId,
                        read: false
                    })
                });
                if (!notifRes.ok) {
                    console.error("Failed to send notification", await notifRes.text());
                }
            }

            await loadComments(itemId);
        } catch (e) { console.error("Failed to create comment", e); }
    }

    const postBtn = document.getElementById("post-comment-btn");
    const commentInput = document.getElementById("comment-input");
    if (postBtn && commentInput) {
        postBtn.addEventListener("click", async () => {
            const text = commentInput.value.trim();
            if (text) {
                await createComment(text, null);
                commentInput.value = "";
            }
        });
    }

    const commentsContainer = document.getElementById("comments-list");
    if (commentsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const currentItemId = urlParams.get('id');
        if (currentItemId) {
            loadComments(currentItemId);
        }
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            try {
                const res = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
                const users = await res.json();
                
                if (users.length > 0) {
                    const user = users[0];
                    storage.setIsLoggedIn(true);
                    storage.setUserId(user.id);
                    storage.setUserName(user.username);
                    storage.setUserEmail(user.email);
                    updateAuthNav();
                    window.location.href = "profile.html";
                } else {
                    alert("Invalid email or password!");
                }
            } catch (err) { console.error(err); }
        });
    }

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("register-username").value.trim();
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;

            try {
                const check = await fetch(`${API_URL}/users?email=${email}`);
                if ((await check.json()).length > 0) {
                    alert("Email already in use!");
                    return;
                }

                const newUser = { id: String(Date.now()), username, email, password };
                await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });

                storage.setIsLoggedIn(true);
                storage.setUserId(newUser.id);
                storage.setUserName(username);
                storage.setUserEmail(email);
                updateAuthNav();
                window.location.href = "profile.html";
            } catch (err) { console.error(err); }
        });
    }

    const uploadForm = document.getElementById("upload-form");
    if (uploadForm) {
        uploadForm.addEventListener("submit", async (e) => {
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
            const metrics = document.getElementById("upload-metrics").value.trim();
            const usage = document.getElementById("upload-usage").value.trim();

            const newItem = {
                id: String(Date.now()),
                authorId: storage.getUserId(),
                type, name, task, license,
                framework: framework.toLowerCase(),
                size: file ? `${(file.size / (1024 * 1024)).toFixed(2)}mb` : "n/a",
                downloads: "0",
                stars: 0,
                metrics: metrics,
                desc: shortDesc,
                fullDesc,
                usage: usage
            };

            try {
                await fetch(`${API_URL}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });
                uploadForm.reset();
                renderProfileUploads();
            } catch (err) { console.error("Upload failed", err); }
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
        catalogContainer.addEventListener("click", async (e) => {
            const subBtn = e.target.closest(".subscribe-btn");
            if (subBtn) {
                const id = subBtn.getAttribute("data-subscribe-id");
                if (!id) return;
                handleSubscribeClick(id);
                setSubscribeButtonState(subBtn, isSubscribed(id));
            }

            const starBtn = e.target.closest(".star-btn");
            if (starBtn) {
                if (!storage.getIsLoggedIn()) {
                    window.location.href = "login.html";
                    return;
                }
                const id = starBtn.getAttribute("data-star-id");
                let currentStars = parseInt(starBtn.getAttribute("data-stars")) || 0;
                
                const starred = storage.getStarred();
                const isStarred = starred.includes(id);
                
                const newStarsCount = isStarred ? currentStars - 1 : currentStars + 1;
                
                try {
                    await fetch(`${API_URL}/items/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ stars: newStarsCount })
                    });
                    
                    if (isStarred) {
                        storage.setStarred(starred.filter(sid => sid !== id));
                        starBtn.classList.replace("btn-warning", "btn-outline-warning");
                    } else {
                        starred.push(id);
                        storage.setStarred(starred);
                        starBtn.classList.replace("btn-outline-warning", "btn-warning");
                    }
                    
                    starBtn.setAttribute("data-stars", newStarsCount);
                    starBtn.textContent = `★ ${newStarsCount}`;
                } catch (err) { console.error("Failed to star", err); }
            }
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

    document.addEventListener("click", async (e) => {
        const notifDropdown = e.target.closest("#notifDropdown");
        const notifMenu = document.getElementById("notif-list");
        if (notifDropdown && notifMenu) {
            notifMenu.classList.toggle("show");
        } else if (notifMenu && !e.target.closest(".dropdown")) {
            notifMenu.classList.remove("show");
        }

        if (e.target.classList.contains("delete-notif-btn")) {
            e.preventDefault();
            e.stopPropagation();
            const id = e.target.getAttribute("data-id");
            await fetch(`${API_URL}/notifications/${id}`, { method: 'DELETE' });
            loadNotifications();
        }

        if (e.target.classList.contains("reply-btn")) {
            if (!storage.getIsLoggedIn()) return window.location.href = "login.html";
            const pid = e.target.getAttribute("data-parent-id");
            document.getElementById(`reply-form-${pid}`).classList.remove("d-none");
            e.target.classList.add("d-none");
        }

        if (e.target.classList.contains("cancel-reply-btn")) {
            const pid = e.target.getAttribute("data-parent-id");
            document.getElementById(`reply-form-${pid}`).classList.add("d-none");
            document.querySelector(`.reply-btn[data-parent-id="${pid}"]`).classList.remove("d-none");
            document.getElementById(`reply-input-${pid}`).value = "";
        }

        if (e.target.classList.contains("submit-reply-btn")) {
            const pid = e.target.getAttribute("data-parent-id");
            const parentAuthor = (e.target.getAttribute("data-parent-author") || "User").trim();
            const input = document.getElementById(`reply-input-${pid}`);
            const text = input.value.trim();
            if (text) {
                const mention = `@${parentAuthor}`;
                const finalText = text.startsWith(mention) ? text : `${mention}, ${text}`;
                await createComment(finalText, pid);
                input.value = "";

                document.getElementById(`reply-form-${pid}`).classList.add("d-none");
                document.querySelector(`.reply-btn[data-parent-id="${pid}"]`).classList.remove("d-none");
            }
        }

        if (e.target.id === "logout-btn") {
            if (!window.confirm("Are you sure you want to log out?")) return;
            storage.setIsLoggedIn(false);
            updateAuthNav();
            if (window.location.pathname.endsWith("profile.html")) {
                window.location.href = "index.html";
            }
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