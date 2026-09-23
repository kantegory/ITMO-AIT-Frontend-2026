import { ref, watch } from "vue";

const isDark = ref(localStorage.getItem("theme") === "dark");

watch(isDark, (newVal) => {
  if (newVal) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  }
});

function toggleTheme() {
  isDark.value = !isDark.value;
}

export function useTheme() {
  return { isDark, toggleTheme };
}