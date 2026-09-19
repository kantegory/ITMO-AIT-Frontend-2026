import { ref, computed } from 'vue';
import api from '../api';
const key = 'nexus_lab3_session';
const session = ref(null);
const notice = ref('');
try {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved?.accessToken && saved?.user?.id) session.value = saved;
} catch { localStorage.removeItem(key); }
export function useAuth() {
  async function authenticate(mode, form) {
    session.value = (await api.post('/' + mode, form)).data;
    localStorage.setItem(key, JSON.stringify(session.value));
    notice.value = '';
  }
  function logout(reason = '') {
    session.value = null; localStorage.removeItem(key); notice.value = reason;
  }
  async function restore() {
    if (!session.value) return;
    try { session.value.user = (await api.get('/users/' + session.value.user.id)).data; }
    catch (error) { if ([401,403,404].includes(error.response?.status)) logout('Сессия истекла. Войдите снова.'); }
  }
  return { session, notice, user: computed(() => session.value?.user), authenticate, logout, restore };
}
