import { ref } from "vue";

const THEME_STORAGE_KEY = "tripatropa-theme";

function readTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch (e) {
    return "light";
  }
}

const theme = ref(readTheme());

export function useTheme() {
  function toggle() {
    if (theme.value === "dark") {
      theme.value = "light";
      document.documentElement.removeAttribute("data-theme");
      try {
        localStorage.setItem(THEME_STORAGE_KEY, "light");
      } catch (e) {}
    } else {
      theme.value = "dark";
      document.documentElement.setAttribute("data-theme", "dark");
      try {
        localStorage.setItem(THEME_STORAGE_KEY, "dark");
      } catch (e) {}
    }
  }
  return { theme, toggle };
}
