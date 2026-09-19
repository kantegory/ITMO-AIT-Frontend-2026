const form = document.querySelector('.axon-auth-form');
const fields = [...form.querySelectorAll('input')];
const status = document.querySelector('#form-status');
const requiredMessages = {
  displayName: 'Enter your display name.',
  email: 'Enter your email address.',
  password: 'Enter your password.',
};

function showError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);

  error.textContent = message;
  error.hidden = !message;

  if (message) {
    field.setAttribute('aria-invalid', 'true');
  } else {
    field.removeAttribute('aria-invalid');
  }
}

function getValidationMessage(field) {
  let message = '';

  if (field.validity.valueMissing) {
    message = requiredMessages[field.name];
  } else if (field.validity.typeMismatch) {
    message = 'Enter a valid email address, such as alex@example.test.';
  } else if (
    field.validity.tooShort ||
    (field.minLength > 0 && field.value.length < field.minLength)
  ) {
    message = `Use at least ${field.minLength} characters.`;
  } else if (
    field.validity.tooLong ||
    (field.maxLength > 0 && field.value.length > field.maxLength)
  ) {
    message = `Use no more than ${field.maxLength} characters.`;
  }

  return message;
}

function handleSubmit(event) {
  event.preventDefault();
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

  form.elements.password.value = '';
  status.textContent =
    form.id === 'register-form'
      ? 'Preview complete. The form is valid; no account was created. Your details were not sent or saved by AxonHub.'
      : 'Preview complete. The form is valid; you are not signed in. Your details were not sent or saved by AxonHub.';
}

form.addEventListener('submit', handleSubmit);

for (const field of fields) {
  field.addEventListener('input', () => {
    showError(field, '');
    status.textContent = '';
  });
}

form.querySelector('button[type="submit"]').disabled = false;
