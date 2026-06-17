<template>
    <div :class="{ 'ms-4 mt-2': level > 0 }">
        <div
            v-for="comment in visibleComments"
            :key="comment.id"
            class="mb-3 border-bottom pb-2"
        >
            <div class="d-flex justify-content-between align-items-start gap-2">
                <strong>{{ comment.userName || "User" }}</strong>
                <button
                    type="button"
                    class="btn btn-sm btn-link p-0 text-secondary text-decoration-none"
                    title="Reply"
                    @click="toggleReply(comment.id)"
                >
                    Reply
                </button>
            </div>

            <p class="mb-1 text-muted small">{{ comment.text }}</p>

            <div v-if="openedReplyId === comment.id" class="mt-2">
                <textarea
                    v-model="replyText"
                    class="form-control form-control-sm mb-1"
                    rows="2"
                    placeholder="Write a reply..."
                />
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-primary btn-sm" @click="submitReply(comment)">Send</button>
                    <button type="button" class="btn btn-secondary btn-sm" @click="cancelReply">Cancel</button>
                </div>
            </div>

            <CommentThread
                v-if="hasChildren(comment.id)"
                :comments="comments"
                :parent-id="String(comment.id)"
                :level="level + 1"
                @reply="$emit('reply', $event)"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    comments: {
        type: Array,
        default: () => []
    },
    parentId: {
        type: String,
        default: null
    },
    level: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(["reply"]);

const openedReplyId = ref(null);
const replyText = ref("");

const normalizeParentId = (value) => {
    if (value == null || value === "" || value === "null" || value === "undefined") return null;
    return String(value);
};

const visibleComments = computed(() => {
    return props.comments.filter((c) => normalizeParentId(c.parentId) === props.parentId);
});

const hasChildren = (commentId) => {
    return props.comments.some((c) => normalizeParentId(c.parentId) === String(commentId));
};

const toggleReply = (id) => {
    openedReplyId.value = openedReplyId.value === id ? null : id;
    replyText.value = "";
};

const cancelReply = () => {
    openedReplyId.value = null;
    replyText.value = "";
};

const submitReply = (parentComment) => {
    const text = replyText.value.trim();
    if (!text) return;

    const mention = `@${parentComment.userName || "User"}`;
    const message = text.startsWith(mention) ? text : `${mention}, ${text}`;

    emit("reply", {
        text: message,
        parentId: parentComment.id
    });

    cancelReply();
};
</script>
