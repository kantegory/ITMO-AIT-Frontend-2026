import { register } from '../api/auth';
import { extractErrorMessage } from '../api/client';
import { redirectIfAuthed } from '../utils/guard';
import { mustGet } from '../utils/render';
import type { UserRole } from '../types/domain';

redirectIfAuthed();

const form = mustGet<HTMLFormElement>('#regForm');
form.addEventListener('submit', (e) => e.preventDefault(), { capture: true });
const nameInput = mustGet<HTMLInputElement>('#name');
const emailInput = mustGet<HTMLInputElement>('#email');
const passwordInput = mustGet<HTMLInputElement>('#password');
const confirmInput = mustGet<HTMLInputElement>('#confirm');
const roleSelect = mustGet<HTMLSelectElement>('#role');
const termsInput = mustGet<HTMLInputElement>('#terms');
const termsErr = mustGet<HTMLSpanElement>('#termsErr');
const submitBtn = mustGet<HTMLButtonElement>('#submitBtn');
const formError = mustGet<HTMLDivElement>('#formError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldCheck {
  el: HTMLInputElement;
  ok: boolean;
}

function showFormError(msg: string): void {
  formError.textContent = msg;
  formError.style.display = 'block';
}

function clearFormError(): void {
  formError.textContent = '';
  formError.style.display = 'none';
}

(['name', 'email', 'password', 'confirm'] as const).forEach((id) => {
  const el = document.getElementById(id);
  el?.addEventListener('input', () => el.classList.remove('is-invalid', 'is-valid'));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearFormError();

  const checks: FieldCheck[] = [
    { el: nameInput, ok: nameInput.value.trim().length >= 2 },
    { el: emailInput, ok: EMAIL_REGEX.test(emailInput.value) },
    { el: passwordInput, ok: passwordInput.value.length >= 8 },
    {
      el: confirmInput,
      ok: confirmInput.value === passwordInput.value && confirmInput.value !== '',
    },
  ];

  let valid = true;
  for (const { el, ok } of checks) {
    if (ok) {
      el.classList.remove('is-invalid');
      el.classList.add('is-valid');
    } else {
      el.classList.add('is-invalid');
      el.classList.remove('is-valid');
      valid = false;
    }
  }

  if (!termsInput.checked) {
    termsErr.style.display = 'block';
    valid = false;
  } else {
    termsErr.style.display = 'none';
  }

  if (!valid) return;

  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Создаём аккаунт…';
  try {
    await register({
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      role: roleSelect.value as UserRole,
    });
    location.href = '/dashboard.html';
  } catch (err) {
    showFormError(extractErrorMessage(err, 'Не удалось зарегистрироваться'));
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});
