const requiredMessages = {
  displayName: 'Enter your display name.',
  email: 'Enter your email address.',
  password: 'Enter your password.',
};

export function showError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);

  error.textContent = message;
  error.hidden = !message;

  if (message) {
    field.setAttribute('aria-invalid', 'true');
  } else {
    field.removeAttribute('aria-invalid');
  }
}

export function getValidationMessage(field) {
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
  } else if (field.name === 'password' && new TextEncoder().encode(field.value).length > 72) {
    message = 'Use a shorter password: at most 72 bytes (some characters use more than one).';
  }

  return message;
}
