<template>
    <BaseLayout>
        <div v-if="loading" class="text-center my-5">
            <p>Loading...</p>
        </div>

        <div v-else-if="!item">
            <h1>Item not found</h1>
        </div>

        <template v-else>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>{{ item.name }}</h1>
                    <p class="text-muted">
                        <span class="badge" :class="item.type === 'model' ? 'bg-primary' : 'bg-success'">{{ item.type.toUpperCase() }}</span>
                    </p>
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn" :class="isStarred ? 'btn-warning' : 'btn-outline-warning'" @click="toggleStar">
                        <svg class="icon me-1" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                            <path
                                fill="currentColor"
                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"
                            />
                        </svg>
                        {{ item.stars }}
                    </button>
                    <button type="button" class="btn" :class="isSubscribed ? 'btn-outline-danger' : 'btn-outline-primary'" @click="toggleSubscription">
                        {{ isSubscribed ? "Unsubscribe" : "Subscribe" }}
                    </button>
                </div>
            </div>

            <div class="row">
                <div class="col-md-8">
                    <div class="item-card">
                        <h4>Description</h4>
                        <p>{{ item.fullDesc || item.desc }}</p>

                        <h4 class="mt-4">Usage Example</h4>
                        <pre class="bg-light p-3 border rounded"><code>{{ item.usage }}</code></pre>
                    </div>

                    <div class="mt-4">
                        <h4>Discussions & Reproducibility</h4>
                        <div class="item-card mb-3">
                            <CommentThread :comments="comments" @reply="({ text, parentId }) => submitComment(text, parentId)" />

                            <div class="mt-3">
                                <label for="comment-input" class="form-label">Comment</label>
                                <textarea id="comment-input" v-model="newComment" class="form-control mb-2" rows="2" placeholder="Start a discussion..."></textarea>
                                <button type="button" class="btn btn-sm btn-primary" @click="submitComment(newComment, null)">Post Comment</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="item-card">
                        <h4>Metadata</h4>
                        <ul class="list-unstyled">
                            <li class="mb-2"><strong>License:</strong> {{ item.license.toUpperCase() }}</li>
                            <li class="mb-2"><strong>Size:</strong> {{ item.size }}</li>
                            <li class="mb-2"><strong>Task:</strong> {{ item.task.toUpperCase() }}</li>
                            <li class="mb-2"><strong>Framework:</strong> {{ item.framework.toUpperCase() }}</li>
                            <li class="mb-2"><strong>Metrics:</strong> <br /><span class="text-success fw-bold">{{ item.metrics }}</span></li>
                        </ul>

                        <button type="button" class="btn btn-primary w-100 mt-3" @click="downloadItem">
                            Download ({{ item.downloads }})
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </BaseLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createComment, getCommentById, getCommentsByItem } from "../api/comments";
import { createNotification } from "../api/notifications";
import { getItemById, patchItem } from "../api/items";
import CommentThread from "../components/CommentThread.vue";
import { useAuth } from "../composables/useAuth";
import { useUserCollections } from "../composables/useUserCollections";
import BaseLayout from "../layouts/BaseLayout.vue";
import { formatDownloads, parseDownloads } from "../utils/formatters";
import { generateId } from "../utils/id";

const route = useRoute();
const router = useRouter();

const { user, isLoggedIn } = useAuth();
const { subscriptions, starred } = useUserCollections();

const loading = ref(false);
const item = ref(null);
const comments = ref([]);
const newComment = ref("");

const isSubscribed = computed(() => subscriptions.includes(route.params.id));
const isStarred = computed(() => starred.includes(route.params.id));

const ensureAuth = () => {
    if (isLoggedIn.value) return true;
    router.push({ name: "login", query: { redirect: route.fullPath } });
    return false;
};

const loadComments = async () => {
    comments.value = await getCommentsByItem(route.params.id);
};

const loadItem = async () => {
    loading.value = true;
    try {
        item.value = await getItemById(route.params.id);
        await loadComments();
        if (item.value?.name) {
            document.title = `${item.value.name} - AI Hub`;
        }
    } finally {
        loading.value = false;
    }
};

const toggleSubscription = () => {
    if (!ensureAuth()) return;
    subscriptions.toggle(route.params.id);
};

const toggleStar = async () => {
    if (!ensureAuth() || !item.value) return;

    const nextStars = isStarred.value ? Math.max(0, item.value.stars - 1) : item.value.stars + 1;
    await patchItem(item.value.id, { stars: nextStars });
    item.value.stars = nextStars;
    starred.toggle(item.value.id);
};

const sendNotifications = async (parentId) => {
    if (!item.value || !user.value) return;

    const recipients = new Map();
    if (item.value.authorId && String(item.value.authorId) !== String(user.value.id)) {
        recipients.set(String(item.value.authorId), "comment");
    }

    if (parentId) {
        const parentComment = await getCommentById(parentId);
        if (parentComment?.userId && String(parentComment.userId) !== String(user.value.id)) {
            recipients.set(String(parentComment.userId), "reply");
        }
    }

    await Promise.all(
        [...recipients.entries()].map(([userId, type]) => {
            return createNotification({
                id: generateId(),
                userId,
                actorName: user.value.username,
                type,
                itemId: item.value.id,
                read: false
            });
        })
    );
};

const submitComment = async (rawText, parentId) => {
    const text = String(rawText || "").trim();
    if (!text) return;
    if (!ensureAuth()) return;

    await createComment({
        id: generateId(),
        itemId: item.value.id,
        userId: user.value.id,
        userName: user.value.username,
        text,
        parentId
    });

    await sendNotifications(parentId);
    await loadComments();
    newComment.value = "";
};

const downloadItem = async () => {
    if (!item.value) return;

    const nextDownloads = parseDownloads(item.value.downloads) + 1;
    item.value.downloads = formatDownloads(nextDownloads);

    const content = [
        "AI Hub Download",
        `Name: ${item.value.name}`,
        `Task: ${item.value.task}`,
        `Framework: ${item.value.framework}`,
        `License: ${item.value.license}`,
        "",
        `Metrics: ${item.value.metrics}`,
        "Usage:",
        item.value.usage
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.value.name.replace(/\s+/g, "_")}_data.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    await patchItem(item.value.id, {
        downloads: item.value.downloads
    });
};

onMounted(loadItem);
</script>
