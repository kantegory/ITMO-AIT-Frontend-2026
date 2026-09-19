<script setup>
import { ref, useId, nextTick } from 'vue';

const props = defineProps({
  initial: { type: String, default: '' },
  editing: Boolean,
  save: { type: Function, required: true },
});
const emit = defineEmits(['saved', 'cancel']);
const body = ref(props.initial);
const pending = ref(false);
const error = ref('');
const input = ref(null);
const id = useId();

async function submit() {
  if (pending.value) {
    return;
  }

  error.value = '';

  if (!body.value.trim() || body.value.trim().length > 1000) {
    error.value = 'Enter 1–1000 characters.';
    input.value.focus();

    return;
  }

  pending.value = true;

  try {
    await props.save(body.value.trim());
    body.value = '';
    emit('saved');

    if (!props.editing) {
      await nextTick();
      input.value?.focus();
    }
  } catch (cause) {
    error.value = cause.message;
  } finally {
    pending.value = false;
  }
}
</script>
<template>
  <form novalidate @submit.prevent="submit" :aria-busy="pending">
    <label class="form-label" :for="id">{{ editing ? 'Edit your comment' : 'Your comment' }}</label>
    <textarea
      :id="id"
      ref="input"
      v-model="body"
      class="form-control"
      required
      maxlength="1000"
      rows="3"
      :aria-describedby="`${id}-hint ${id}-error`"
      :aria-invalid="!!error"
      :disabled="pending"
    />
    <p :id="`${id}-hint`" class="form-text">1–1000 characters. Plain text only.</p>
    <p :id="`${id}-error`" role="alert" class="axon-error">{{ error }}</p>
    <button class="btn btn-primary" :disabled="pending">
      {{ pending ? 'Saving…' : editing ? 'Save comment' : 'Post comment' }}
    </button>
    <button
      v-if="editing"
      class="btn btn-outline-primary ms-2"
      type="button"
      :disabled="pending"
      @click="emit('cancel')"
    >
      Cancel edit
    </button>
  </form>
</template>
