import { computed, ref } from 'vue';
import { api } from '../services/api';
import { createDemoSeed } from '../constants/finance';

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('tarelka-user'));
  } catch {
    return null;
  }
}

const currentUser = ref(readUser());
const token = ref(localStorage.getItem('tarelka-token') || '');

function saveSession(user, accessToken) {
  const safeUser = user ? { ...user } : null;
  if (safeUser) delete safeUser.password;
  currentUser.value = safeUser;
  token.value = accessToken || '';
  localStorage.setItem('tarelka-user', JSON.stringify(safeUser));
  localStorage.setItem('tarelka-token', token.value);
}

async function postMany(collection, items) {
  for (const item of items) {
    await api.post(`/${collection}`, item);
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(currentUser.value && token.value));

  async function login(email, password) {
    const { data } = await api.post('/login', {
      email: email.trim().toLowerCase(),
      password
    });
    saveSession(data.user, data.accessToken);
    return currentUser.value;
  }

  async function register(payload) {
    const body = {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      currency: payload.currency,
      monthlyGoal: Number(payload.monthlyGoal) || 30000,
      createdAt: new Date().toISOString()
    };
    const { data } = await api.post('/register', body);
    saveSession(data.user, data.accessToken);

    const seed = createDemoSeed(currentUser.value.id, currentUser.value.currency, currentUser.value.monthlyGoal);
    await postMany('accounts', seed.accounts);
    await postMany('budgets', seed.budgets);
    await postMany('transactions', seed.transactions);
    await postMany('integrations', seed.integrations);
    await postMany('importRules', seed.importRules);
    await postMany('imports', seed.imports);

    return currentUser.value;
  }

  function logout() {
    currentUser.value = null;
    token.value = '';
    localStorage.removeItem('tarelka-user');
    localStorage.removeItem('tarelka-token');
  }

  return { currentUser, token, isAuthenticated, login, register, logout };
}
