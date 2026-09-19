import { ref, onMounted, onUnmounted } from 'vue';

export function useTheme() {
  const theme = ref(document.documentElement.dataset.theme || 'light');
  const sync = () => {
    theme.value = document.documentElement.dataset.theme;
  };
  onMounted(() => window.addEventListener('axon-theme-change', sync));
  onUnmounted(() => window.removeEventListener('axon-theme-change', sync));

  return { theme, toggleTheme: (event) => window.axonTheme.toggle(event.currentTarget) };
}
