import { getValidationMessage, showError } from './forms/validation.js';
import { login, register } from './services/auth.js';
import { saveSession, getReturnPath } from './session.js';

const form = document.querySelector('.axon-auth-form');
const submit = form.querySelector('button[type="submit"]');
const fields = [...form.querySelectorAll('input')];
const status = document.querySelector('#form-status');
const isRegistering = form.id === 'register-form';

async function handleSubmit(event) {
  event.preventDefault();

  if (submit.disabled) {
    return;
  }

  status.textContent = '';

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

  if (firstInvalid) {
    firstInvalid.focus();

    return;
  }

  submit.disabled = true;
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
    location.assign(
      isRegistering
        ? 'profile.html'
        : getReturnPath(new URLSearchParams(location.search).get('returnTo')),
    );
  } catch (error) {
    if (isRegistering) {
      if (error.status === 409) {
        showError(
          form.elements.email,
          'This email is already registered. Log in or use another email.',
        );
        form.elements.email.focus();
      }

      status.textContent = accountCreated
        ? 'Account created, but the session could not be saved. Allow browser session storage, then log in.'
        : error.status === 409
          ? 'Account not created. Check the highlighted email field.'
          : error.status === 400
            ? 'Check your account details and try again.'
            : 'Could not confirm registration. Check the local API. Try logging in before submitting again.';
    } else {
      status.textContent =
        error.status === 400 || error.status === 401
          ? 'Email or password is incorrect.'
          : 'Could not sign in. Check the local API and browser session storage, then try again.';
    }
  } finally {
    form.elements.password.value = '';
    submit.disabled = false;
  }
}

form.addEventListener('submit', handleSubmit);

for (const field of fields) {
  field.addEventListener('input', () => {
    showError(field, '');
    status.textContent = '';
  });
}

form.querySelector('button[type="submit"]').disabled = false;
