import { $ } from "./utils.js";

export function initPasswordToggle() {
  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    const input = button.parentElement?.querySelector("[data-password-input]");
    if (!input) return;

    const syncState = () => {
      const isPassword = input.type === "password";
      button.setAttribute("aria-label", isPassword ? "Показать пароль" : "Скрыть пароль");
      button.setAttribute("aria-pressed", String(!isPassword));
      button.innerHTML = isPassword
        ? '<i class="bi bi-eye" aria-hidden="true"></i>'
        : '<i class="bi bi-eye-slash" aria-hidden="true"></i>';
    };

    syncState();
    button.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      syncState();
    });
  });
}

export function initPasswordStrength() {
  const input = $("[data-strength-input]");
  const bar = $("[data-strength-bar]");
  const text = $("[data-strength-text]");
  if (!input || !bar || !text) return;

  const updateStrength = () => {
    const password = input.value.trim();
    let percent = 0;
    let label = "Укажите пароль";

    if (password.length >= 12) {
      percent = 100;
      label = "Сильный пароль";
    } else if (password.length >= 8) {
      percent = 70;
      label = "Нормально для демо";
    } else if (password.length > 0) {
      percent = 35;
      label = "Лучше сделать подлиннее";
    }

    bar.style.width = `${percent}%`;
    bar.setAttribute("aria-valuenow", String(percent));
    text.textContent = label;
  };

  input.addEventListener("input", updateStrength);
  updateStrength();
}

export function initModal(id, bindings, defaults = {}) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.addEventListener("show.bs.modal", ({ relatedTarget }) => {
    Object.entries(bindings).forEach(([selector, attribute]) => {
      const node = $(selector, modal);
      if (node) {
        node.textContent = relatedTarget?.getAttribute(attribute) || defaults[selector] || "";
      }
    });
  });
}

export function showMessage(node, message, type = "danger") {
  if (!node) return;
  node.className = `alert alert-${type} mb-0`;
  node.textContent = message;
  node.setAttribute("aria-hidden", "false");
  node.classList.remove("d-none");
}

export function clearMessage(node) {
  if (!node) return;
  node.classList.add("d-none");
  node.textContent = "";
  node.setAttribute("aria-hidden", "true");
}

export function toggleBusy(button, isBusy, busyText) {
  if (!button) return;
  if (!button.dataset.defaultText) {
    button.dataset.defaultText = button.textContent.trim();
  }

  button.disabled = isBusy;
  button.setAttribute("aria-busy", String(isBusy));
  button.textContent = isBusy ? busyText : button.dataset.defaultText;
}

export function showPageError(message) {
  const targets = [
    document.querySelector("[data-form-message]"),
    document.querySelector("[data-rule-message]"),
  ];

  for (const target of targets) {
    if (target) {
      showMessage(target, message);
      return;
    }
  }

  const fallback = document.querySelector(".page-banner__copy") || document.querySelector(".hero-copy");
  if (fallback) {
    fallback.textContent = message;
  }
}
