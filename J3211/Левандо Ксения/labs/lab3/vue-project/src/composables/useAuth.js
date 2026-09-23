import { ref } from "vue";

const user = ref(JSON.parse(localStorage.getItem("user")));
const isAuth = ref(localStorage.getItem("auth") === "true");

const organizer = ref(JSON.parse(localStorage.getItem("organizer")));
const isOrganizer = ref(localStorage.getItem("organizerAuth") === "true");

function login(userData) {
  localStorage.setItem("auth", "true");
  localStorage.setItem("user", JSON.stringify(userData));
  user.value = userData;
  isAuth.value = true;
}

function loginOrganizer(orgData) {
  localStorage.setItem("organizerAuth", "true");
  localStorage.setItem("organizer", JSON.stringify(orgData));
  organizer.value = orgData;
  isOrganizer.value = true;
}

function logout() {
  if (isOrganizer.value) {
    localStorage.removeItem("organizerAuth");
    localStorage.removeItem("organizer");
    organizer.value = null;
    isOrganizer.value = false;
  }
  if (isAuth.value) {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    user.value = null;
    isAuth.value = false;
  }
}

export function useAuth() {
  return {
    user,
    isAuth,
    organizer,
    isOrganizer,
    login,
    loginOrganizer,
    logout,
  };
}