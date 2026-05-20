import { login } from '../api/auth';
import { extractErrorMessage } from '../api/client';
import { redirectIfAuthed } from '../utils/guard';
import { mustGet } from '../utils/render';
import { initTheme } from '../utils/theme';

initTheme();
redirectIfAuthed();

const form = mustGet<HTMLFormElement>('#loginForm');
form.addEventListener('submit', (e) => e.preventDefault(), { capture: true });
const emailInput = mustGet<HTMLInputElement>('#email');
const passwordInput = mustGet<HTMLInputElement>('#password');
const togglePwdBtn = mustGet<HTMLButtonElement>('#togglePwd');
const eyeOn = mustGet<SVGElement>('#eyeOn');
const eyeOff = mustGet<SVGElement>('#eyeOff');
const submitBtn = mustGet<HTMLButtonElement>('#submitBtn');
const formError = mustGet<HTMLDivElement>('#formError');

togglePwdBtn.addEventListener('click', () => {
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  eyeOn.style.display = show ? 'none' : '';
  eyeOff.style.display = show ? '' : 'none';
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(message: string): void {
  formError.textContent = message;
  formError.style.display = 'block';
}

function clearError(): void {
  formError.textContent = '';
  formError.style.display = 'none';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  let valid = true;
  if (!EMAIL_REGEX.test(emailInput.value)) {
    emailInput.classList.add('is-invalid');
    valid = false;
  } else {
    emailInput.classList.remove('is-invalid');
  }
  if (!passwordInput.value) {
    passwordInput.classList.add('is-invalid');
    valid = false;
  } else {
    passwordInput.classList.remove('is-invalid');
  }
  if (!valid) return;

  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Входим…';
  try {
    await login({ email: emailInput.value, password: passwordInput.value });
    location.href = '/dashboard.html';
  } catch (err) {
    showError(extractErrorMessage(err, 'Не удалось войти'));
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});
