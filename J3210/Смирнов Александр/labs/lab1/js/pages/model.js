import { API_URL, fetchAllItems } from "../core/api.js";
import { initSharedPage } from "../core/layout.js";
import { storage } from "../core/storage.js";
import { escapeHtml, formatDownloads, parseDownloads } from "../core/utils.js";

const ICON_SPRITE = "components/icons-sprite.svg";
const starIcon = `<svg class="icon icon-sm" aria-hidden="true" focusable="false"><use href="${ICON_SPRITE}#icon-star"></use></svg>`;
const replyIcon = `<svg class="icon icon-sm" aria-hidden="true" focusable="false"><use href="${ICON_SPRITE}#icon-reply"></use></svg>`;

document.addEventListener("DOMContentLoaded", async () => {
    await initSharedPage();

    const detailName = document.getElementById("detail-name");
    const detailSubscribeBtn = document.getElementById("btn-subscribe");

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
    }

    function setSubscribeButtonState(button, subscribed) {
        if (!button) return;
        button.textContent = subscribed ? "Unsubscribe" : "Subscribe";
        button.setAttribute("aria-pressed", String(subscribed));
        button.classList.toggle("btn-outline-primary", !subscribed);
        button.classList.toggle("btn-outline-danger", subscribed);
    }

    function handleSubscribeClick(itemId) {
        if (!storage.getIsLoggedIn()) {
            window.location.href = "login.html";
            return;
        }
        toggleSubscription(itemId);
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
            const isRoot = c.parentId == null || c.parentId === "" || c.parentId === "null" || c.parentId === "undefined";
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
                        <button class="btn btn-sm btn-link p-0 text-secondary text-decoration-none reply-btn" data-parent-id="${comment.id}" data-parent-author="${escapeHtml(comment.userName || "User")}" title="Reply" aria-label="Reply">${replyIcon}</button>
                    </div>
                    <p class="mb-1 text-muted small">${escapeHtml(comment.text)}</p>

                    <div class="mt-2 d-none reply-form" id="reply-form-${comment.id}">
                        <textarea class="form-control form-control-sm mb-1" id="reply-input-${comment.id}" rows="1" placeholder="Write a reply..." aria-label="Reply text"></textarea>
                        <button type="button" class="btn btn-primary btn-sm submit-reply-btn" data-parent-id="${comment.id}" data-parent-author="${escapeHtml(comment.userName || "User")}">Send</button>
                        <button type="button" class="btn btn-secondary btn-sm cancel-reply-btn" data-parent-id="${comment.id}">Cancel</button>
                    </div>

                    ${children.map((child) => renderNode(child, level + 1)).join("")}
                </div>
            `;
        };

        list.innerHTML = rootComments.map((c) => renderNode(c)).join("");
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

            renderComments(comments.filter((c) => String(c.itemId) === String(itemId)));
        } catch (e) {
            console.error("Failed to load comments", e);
        }
    }

    async function createComment(text, parentId = null) {
        if (!storage.getIsLoggedIn()) {
            window.location.href = "login.html";
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const itemId = params.get("id");
        const userId = storage.getUserId();
        const userName = storage.getUserName();

        try {
            const createRes = await fetch(`${API_URL}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: String(Date.now()), itemId, userId, userName, text, parentId })
            });
            if (!createRes.ok) throw new Error("Failed to save comment");

            const notificationsToSend = new Map();

            const itemRes = await fetch(`${API_URL}/items/${itemId}`);
            if (itemRes.ok) {
                const item = await itemRes.json();
                if (item.authorId && String(item.authorId) !== String(userId)) {
                    notificationsToSend.set(String(item.authorId), "comment");
                }
            }

            if (parentId) {
                const parentRes = await fetch(`${API_URL}/comments/${parentId}`);
                if (parentRes.ok) {
                    const parentComment = await parentRes.json();
                    if (String(parentComment.userId) !== String(userId)) {
                        notificationsToSend.set(String(parentComment.userId), "reply");
                    }
                }
            }

            for (const [targetUserId, notificationType] of notificationsToSend.entries()) {
                const notifRes = await fetch(`${API_URL}/notifications`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
        } catch (e) {
            console.error("Failed to create comment", e);
        }
    }

    if (detailName) {
        const params = new URLSearchParams(window.location.search);
        const itemId = params.get("id");

        if (!itemId) {
            detailName.textContent = "Invalid item ID";
        } else {
            const item = (await fetchAllItems()).find((x) => String(x.id) === String(itemId));

            if (item) {
                document.title = `${item.name} - AI Hub`;
                detailName.textContent = item.name;

                const typeBadge = document.getElementById("detail-type");
                typeBadge.textContent = item.type.toUpperCase();
                typeBadge.className = `badge ${item.type === "model" ? "bg-primary" : "bg-success"}`;

                const starBtn = document.getElementById("detail-stars");
                const isStarred = storage.getStarred().includes(String(item.id));
                starBtn.innerHTML = `${starIcon} <span>${item.stars}</span>`;
                starBtn.className = `btn ${isStarred ? "btn-warning" : "btn-outline-warning"}`;
                starBtn.setAttribute("aria-pressed", String(isStarred));

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
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ stars: newStarsCount })
                        });

                        item.stars = newStarsCount;
                        if (currentlyStarred) {
                            storage.setStarred(starred.filter((id) => id !== String(item.id)));
                            starBtn.className = "btn btn-outline-warning";
                            starBtn.setAttribute("aria-pressed", "false");
                        } else {
                            starred.push(String(item.id));
                            storage.setStarred(starred);
                            starBtn.className = "btn btn-warning";
                            starBtn.setAttribute("aria-pressed", "true");
                        }

                        starBtn.innerHTML = `${starIcon} <span>${newStarsCount}</span>`;
                    } catch (err) {
                        console.error(err);
                    }
                };

                document.getElementById("detail-desc").textContent = item.fullDesc || item.desc;
                document.getElementById("detail-usage").textContent = item.usage;

                document.getElementById("detail-lic").textContent = item.license.toUpperCase();
                document.getElementById("detail-size").textContent = item.size;
                document.getElementById("detail-task").textContent = item.task.toUpperCase();
                document.getElementById("detail-fw").textContent = item.framework.toUpperCase();
                document.getElementById("detail-metrics").textContent = item.metrics;
                document.getElementById("detail-dl").textContent = item.downloads;

                const dlButton = document.getElementById("detail-download-btn");
                dlButton.onclick = async () => {
                    let currentCount = parseDownloads(item.downloads);
                    currentCount += 1;
                    item.downloads = formatDownloads(currentCount);

                    document.getElementById("detail-dl").textContent = item.downloads;

                    const content = `AI Hub Download\nName: ${item.name}\nTask: ${item.task}\nFramework: ${item.framework}\nLicense: ${item.license}\n\nMetrics: ${item.metrics}\nUsage:\n${item.usage}\n`;
                    const blob = new Blob([content], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${item.name.replace(/\s+/g, "_")}_data.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    try {
                        await fetch(`${API_URL}/items/${item.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ downloads: item.downloads })
                        });
                    } catch (err) {
                        console.error("Failed to update downloads", err);
                    }
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

    const postBtn = document.getElementById("post-comment-btn");
    const commentInput = document.getElementById("comment-input");
    if (postBtn && commentInput) {
        postBtn.addEventListener("click", async () => {
            const text = commentInput.value.trim();
            if (!text) return;
            await createComment(text, null);
            commentInput.value = "";
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
        const replyBtn = e.target.closest(".reply-btn");
        if (replyBtn) {
            if (!storage.getIsLoggedIn()) {
                window.location.href = "login.html";
                return;
            }

            const pid = replyBtn.getAttribute("data-parent-id");
            document.getElementById(`reply-form-${pid}`).classList.remove("d-none");
            replyBtn.classList.add("d-none");
        }

        const cancelReplyBtn = e.target.closest(".cancel-reply-btn");
        if (cancelReplyBtn) {
            const pid = cancelReplyBtn.getAttribute("data-parent-id");
            document.getElementById(`reply-form-${pid}`).classList.add("d-none");
            document.querySelector(`.reply-btn[data-parent-id="${pid}"]`).classList.remove("d-none");
            document.getElementById(`reply-input-${pid}`).value = "";
        }

        const submitReplyBtn = e.target.closest(".submit-reply-btn");
        if (submitReplyBtn) {
            const pid = submitReplyBtn.getAttribute("data-parent-id");
            const parentAuthor = (submitReplyBtn.getAttribute("data-parent-author") || "User").trim();
            const input = document.getElementById(`reply-input-${pid}`);
            const text = input.value.trim();
            if (!text) return;

            const mention = `@${parentAuthor}`;
            const finalText = text.startsWith(mention) ? text : `${mention}, ${text}`;
            await createComment(finalText, pid);
            input.value = "";

            document.getElementById(`reply-form-${pid}`).classList.add("d-none");
            document.querySelector(`.reply-btn[data-parent-id="${pid}"]`).classList.remove("d-none");
        }
    });
});
