<script setup>
import { ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { session } from '../composables/useSession.js';
import { useLoad } from '../composables/useLoad.js';
import { getComments, postComment, editComment, deleteComment } from '../services/social.js';
import DiscussionForm from './DiscussionForm.vue';
import Icon from './Icon.vue';

const props = defineProps({ resourceId: { type: Number, required: true } });
const route = useRoute();
const { data, loading, error, reload } = useLoad(() => getComments(props.resourceId));
const editing = ref(null);
const deleting = ref(null);
const pendingDelete = ref(false);
const actionError = ref('');
const announcement = ref('');
const heading = ref(null);
let returnFocus;

async function beginEdit(comment, event) {
  const row = event.currentTarget.closest('li');
  returnFocus = event.currentTarget;
  editing.value = comment.id;
  deleting.value = null;
  await nextTick();
  row?.querySelector('textarea')?.focus();
}

async function finishEdit(message = '') {
  editing.value = null;
  announcement.value = message;
  await nextTick();

  if (returnFocus?.isConnected) {
    returnFocus.focus();
  } else {
    heading.value?.focus();
  }
}

async function saveEdit(id, body) {
  await editComment(id, body);
  await reload();
}

async function create(body) {
  if (!session.value) {
    throw new Error('Log in before posting.');
  }

  await postComment(props.resourceId, session.value.user, body);
  await reload();
  announcement.value = 'Comment posted.';
}

function beginDelete(commentId) {
  deleting.value = commentId;
  actionError.value = '';
}

function cancelDelete() {
  deleting.value = null;
  heading.value?.focus();
}

async function remove(id) {
  if (pendingDelete.value) {
    return;
  }

  pendingDelete.value = true;
  actionError.value = '';

  try {
    await deleteComment(id);
    deleting.value = null;
    await reload();
    announcement.value = 'Comment deleted.';
    await nextTick();
    heading.value?.focus();
  } catch (cause) {
    actionError.value = cause.message;
  } finally {
    pendingDelete.value = false;
  }
}
</script>
<template>
  <section aria-labelledby="discussion-heading">
    <h2 id="discussion-heading" ref="heading" tabindex="-1">
      <Icon name="chat-left-text" /> Discussion
    </h2>
    <p v-if="loading" role="status">Loading comments…</p>
    <p class="visually-hidden" role="status" aria-atomic="true">{{ announcement }}</p>
    <div v-if="error" role="alert">
      {{ error.message }}
      <button class="btn btn-outline-primary" @click="reload">Retry comments</button>
    </div>
    <ul v-else-if="data?.length" class="axon-discussion-list">
      <li v-for="comment in data" :key="comment.id">
        <p>
          <strong>{{ comment.authorName }}</strong> ·
          <time :datetime="comment.createdAt">{{
            new Date(comment.createdAt).toLocaleDateString()
          }}</time>
        </p>
        <DiscussionForm
          v-if="editing === comment.id && session?.user.id === comment.userId"
          :initial="comment.body"
          editing
          :save="(body) => saveEdit(comment.id, body)"
          @saved="finishEdit('Comment updated.')"
          @cancel="finishEdit()"
        />
        <template v-else
          ><p class="axon-comment-body">{{ comment.body }}</p>
          <div v-if="session?.user.id === comment.userId" class="axon-comment-actions">
            <button class="btn btn-outline-primary" @click="beginEdit(comment, $event)">
              Edit comment
            </button>
            <button class="btn btn-outline-primary" @click="beginDelete(comment.id)">
              Delete comment
            </button>
          </div>
        </template>
        <div
          v-if="deleting === comment.id && session?.user.id === comment.userId"
          role="group"
          aria-label="Confirm comment deletion"
        >
          <p>Delete this comment? This cannot be undone.</p>
          <button
            class="btn btn-outline-primary"
            :disabled="pendingDelete"
            @click="remove(comment.id)"
          >
            Confirm delete
          </button>
          <button
            class="btn btn-outline-primary ms-2"
            :disabled="pendingDelete"
            @click="cancelDelete"
          >
            Cancel delete
          </button>
          <p role="alert">{{ actionError }}</p>
        </div>
      </li>
    </ul>
    <p v-else-if="!loading && !error">No comments yet. Start the discussion.</p>
    <DiscussionForm v-if="session" :key="session.user.id" :save="create" />
    <RouterLink v-else :to="{ path: '/login', query: { returnTo: route.fullPath } }"
      >Log in to comment</RouterLink
    >
  </section>
</template>
