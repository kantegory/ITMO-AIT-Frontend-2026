import { AuthApi } from "./api.js";
import { clearAuth, getAuth } from "./storage.js";
import { qs, setText } from "./ui.js";

export async function initSessionUI() {
  const auth = getAuth();
  const loginLink = qs('[data-auth="login"]');
  const registerLink = qs('[data-auth="register"]');
  const userBox = qs('[data-auth="userbox"]');
  const userName = qs('[data-auth="username"]');
  const logoutBtn = qs('[data-auth="logout"]');
  const studentNav = document.querySelectorAll('[data-nav-role="student"]');
  const teacherNav = document.querySelectorAll('[data-nav-role="teacher"]');

  function setLoggedOut() {
    if (loginLink) loginLink.classList.remove("d-none");
    if (registerLink) registerLink.classList.remove("d-none");
    if (userBox) userBox.classList.add("d-none");
    if (logoutBtn) logoutBtn.classList.add("d-none");
    setText(userName, "");
    studentNav.forEach((el) => el.classList.remove("d-none"));
    teacherNav.forEach((el) => el.classList.remove("d-none"));
  }

  function setLoggedIn(label) {
    if (loginLink) loginLink.classList.add("d-none");
    if (registerLink) registerLink.classList.add("d-none");
    if (userBox) userBox.classList.remove("d-none");
    if (logoutBtn) logoutBtn.classList.remove("d-none");
    setText(userName, label);
  }

  if (!auth?.token) {
    setLoggedOut();
  } else {
    try {
      const me = await AuthApi.me();
      const label =
        [me.firstName, me.lastName].filter(Boolean).join(" ") || me.email;
      setLoggedIn(label);

      if (me.role === "student") {
        teacherNav.forEach((el) => el.classList.add("d-none"));
        studentNav.forEach((el) => el.classList.remove("d-none"));
      } else if (me.role === "teacher") {
        studentNav.forEach((el) => el.classList.add("d-none"));
        teacherNav.forEach((el) => el.classList.remove("d-none"));
      }
    } catch {
      clearAuth();
      setLoggedOut();
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearAuth();
      window.location.href = "/auth.html#login";
    });
  }
}

