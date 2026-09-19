import { getValidationMessage, showError } from './forms/validation.js';
import { login, register } from './services/auth.js';
import { saveSession, getReturnPath } from './session.js';

const form = document.querySelector('.axon-auth-form');
const submit = form.querySelector('button[type="submit"]');
const fields = [...form.querySelectorAll('input')];
const status = document.querySelector('#form-status');
const summary = document.querySelector('#error-summary');
const isRegistering = form.id === 'register-form';

function updateSummary() {
  const count = fields.filter((field) => field.getAttribute('aria-invalid') === 'true').length;
  summary.textContent =
    count > 1
      ? `Check the ${count} highlighted fields. Each field has an explanation below it.`
      : '';
}

function getSubmissionError(error, accountCreated) {
  if (!isRegistering) {
    return error.status === 400 || error.status === 401
      ? 'Email or password is incorrect.'
      : 'Could not sign in. Check the local API and browser session storage, then try again.';
  }

  if (accountCreated) {
    return 'Account created, but the session could not be saved. Allow browser session storage, then log in.';
  }

  if (error.status === 409) {
    return 'Account not created. Check the highlighted email field.';
  }

  if (error.status === 400) {
    return 'Check your account details and try again.';
  }

  return 'Could not confirm registration. Check the local API. Try logging in before submitting again.';
}

async function handleSubmit(event) {
  event.preventDefault();

  if (submit.disabled) {
    return;
  }

  status.textContent = '';
  status.classList.remove('axon-form-failure');

  let firstInvalid = null;

  for (const field of fields) {
    if (field.name === 'displayName') {
      field.value = field.value.trim();
    }

    const message = getValidationMessage(field);
    showError(field, message);

    if (message && !firstInvalid) {
      firstInvalid = field;
    }
  }

  updateSummary();

  if (firstInvalid) {
    firstInvalid.focus();

    return;
  }

  submit.disabled = true;
  fields.forEach((field) => {
    field.readOnly = true;
  });
  status.textContent = isRegistering ? 'Creating your account...' : 'Signing in...';

  let accountCreated = false;

  try {
    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;
    const session = isRegistering
      ? await register(email, password, form.elements.displayName.value)
      : await login(email, password);
    accountCreated = isRegistering;
    saveSession(session);
    form.elements.password.value = '';
    location.assign(
      isRegistering
        ? 'profile.html'
        : getReturnPath(new URLSearchParams(location.search).get('returnTo')),
    );
  } catch (error) {
    status.classList.add('axon-form-failure');

    if (isRegistering && error.status === 409) {
      showError(
        form.elements.email,
        'This email is already registered. Log in or use another email.',
      );
      form.elements.email.focus();
    }

    status.textContent = getSubmissionError(error, accountCreated);
  } finally {
    fields.forEach((field) => {
      field.readOnly = false;
    });
    submit.disabled = false;
  }
}

form.addEventListener('submit', handleSubmit);

for (const field of fields) {
  field.addEventListener('input', () => {
    showError(field, '');
    updateSummary();
    status.textContent = '';
    status.classList.remove('axon-form-failure');
  });
}

form.querySelector('button[type="submit"]').disabled = false;
