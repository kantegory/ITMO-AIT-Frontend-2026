<script setup>
import { ref, reactive, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { login, register } from '../services/auth.js';
import { saveSession, getReturnPath } from '../composables/useSession.js';

const props = defineProps({ registration: Boolean });
const route = useRoute();
const router = useRouter();
const email = ref('');
const password = ref('');
const displayName = ref('');
const pending = ref(false);
const error = ref('');
const fieldErrors = reactive({ name: '', email: '', password: '' });
const emailInput = ref(null);
const passwordInput = ref(null);
const errorSummary = ref(null);
const nameInput = ref(null);
const submitLabel = computed(() => (props.registration ? 'Create account' : 'Log in'));

function getEmailError() {
  if (!email.value.trim()) {
    return 'Enter your email.';
  }

  return emailInput.value.validity.typeMismatch ? 'Enter a valid email address.' : '';
}

function getPasswordError() {
  if (!password.value) {
    return 'Enter your password.';
  }

  return password.value.length < 8 ? 'Use at least 8 characters.' : '';
}

function getSubmissionError(cause) {
  if (cause.status === 409) {
    return 'This email is already registered.';
  }

  if ([400, 401].includes(cause.status)) {
    return 'Check your email and password.';
  }

  return cause.message;
}

function validateFields() {
  fieldErrors.name =
    props.registration && !displayName.value.trim() ? 'Enter your display name.' : '';
  fieldErrors.email = getEmailError();
  fieldErrors.password = getPasswordError();

  if (fieldErrors.name) {
    return nameInput;
  }

  if (fieldErrors.email) {
    return emailInput;
  }

  if (fieldErrors.password) {
    return passwordInput;
  }

  return null;
}

async function submit() {
  if (pending.value) {
    return;
  }

  error.value = '';

  const firstInvalid = validateFields();

  if (firstInvalid) {
    error.value = 'Check the highlighted fields.';
    await nextTick();
    firstInvalid.value.focus();

    return;
  }

  pending.value = true;

  try {
    const result = props.registration
      ? await register(email.value.trim(), password.value, displayName.value.trim())
      : await login(email.value.trim(), password.value);
    saveSession(result, props.registration ? 'registered' : 'login');
    password.value = '';
    await router.replace(props.registration ? '/profile' : getReturnPath(route.query.returnTo));
  } catch (cause) {
    error.value = getSubmissionError(cause);
    await nextTick();
    errorSummary.value?.focus();
  } finally {
    pending.value = false;
  }
}
</script>
<template>
  <form class="axon-auth-form" novalidate @submit.prevent="submit" :aria-busy="pending">
    <div v-if="registration">
      <label class="form-label" for="display-name">Display name</label>
      <input
        id="display-name"
        ref="nameInput"
        v-model="displayName"
        class="form-control"
        required
        maxlength="60"
        autocomplete="nickname"
        :aria-invalid="!!fieldErrors.name"
        :aria-describedby="fieldErrors.name ? 'name-error' : undefined"
      />
      <p v-if="fieldErrors.name" id="name-error" class="axon-field-error">{{ fieldErrors.name }}</p>
    </div>
    <div>
      <label class="form-label" for="email">Email</label
      ><input
        id="email"
        ref="emailInput"
        :aria-invalid="!!fieldErrors.email"
        :aria-describedby="fieldErrors.email ? 'email-error' : undefined"
        v-model="email"
        class="form-control"
        type="email"
        required
        autocomplete="email"
      />
      <p v-if="fieldErrors.email" id="email-error" class="axon-field-error">
        {{ fieldErrors.email }}
      </p>
    </div>
    <div>
      <label class="form-label" for="password">Password</label
      ><input
        id="password"
        ref="passwordInput"
        :aria-invalid="!!fieldErrors.password"
        v-model="password"
        class="form-control"
        type="password"
        required
        minlength="8"
        :autocomplete="registration ? 'new-password' : 'current-password'"
        :aria-describedby="fieldErrors.password ? 'password-hint password-error' : 'password-hint'"
      />
      <p v-if="fieldErrors.password" id="password-error" class="axon-field-error">
        {{ fieldErrors.password }}
      </p>
      <p id="password-hint" class="form-text">At least 8 characters. Use demo credentials only.</p>
    </div>
    <p v-if="error" ref="errorSummary" role="alert" class="axon-error" tabindex="-1">{{ error }}</p>
    <button class="btn btn-primary" :disabled="pending">
      {{ pending ? 'Please wait…' : submitLabel }}
    </button>
  </form>
</template>
