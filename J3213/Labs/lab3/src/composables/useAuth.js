import { readonly, ref } from 'vue';
import { getCurrentUser, isAuthenticated, logoutUser } from '../services/auth';

const user = ref(getCurrentUser());
const authenticated = ref(isAuthenticated());

export function useAuth() {
  function setUser(nextUser) {
    user.value = nextUser;
    authenticated.value = Boolean(nextUser);
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  return {
    user: readonly(user),
    authenticated: readonly(authenticated),
    setUser,
    logout
  };
}
