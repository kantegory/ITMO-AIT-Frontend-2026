import { ref } from "vue";
import { getCollection } from "@/services/authApi";
import { useAuth } from "./useAuth";
import { sortTransactions } from "@/utils/financeMetrics";

export function useFinanceData() {
  const auth = useAuth();
  const accounts = ref([]);
  const budgets = ref([]);
  const transactions = ref([]);
  const integrations = ref([]);
  const rules = ref([]);
  const loading = ref(false);
  const error = ref("");

  async function loadDashboardData() {
    const currentSession = await auth.ensureSession();
    loading.value = true;
    error.value = "";

    try {
      const [nextAccounts, nextBudgets, nextTransactions] = await Promise.all([
        getCollection("accounts", currentSession.user.id),
        getCollection("budgets", currentSession.user.id),
        getCollection("transactions", currentSession.user.id),
      ]);

      accounts.value = nextAccounts;
      budgets.value = nextBudgets;
      transactions.value = sortTransactions(nextTransactions);
    } catch (requestError) {
      error.value = requestError.message || "Не удалось загрузить данные.";
    } finally {
      loading.value = false;
    }
  }

  async function loadReportsData() {
    const currentSession = await auth.ensureSession();
    loading.value = true;
    error.value = "";

    try {
      const [nextAccounts, nextTransactions] = await Promise.all([
        getCollection("accounts", currentSession.user.id),
        getCollection("transactions", currentSession.user.id),
      ]);

      accounts.value = nextAccounts;
      transactions.value = sortTransactions(nextTransactions);
    } catch (requestError) {
      error.value = requestError.message || "Не удалось загрузить отчеты.";
    } finally {
      loading.value = false;
    }
  }

  async function loadIntegrationsData() {
    const currentSession = await auth.ensureSession();
    loading.value = true;
    error.value = "";

    try {
      const [nextAccounts, nextIntegrations, nextRules] = await Promise.all([
        getCollection("accounts", currentSession.user.id),
        getCollection("integrations", currentSession.user.id),
        getCollection("rules", currentSession.user.id),
      ]);

      accounts.value = nextAccounts;
      integrations.value = nextIntegrations;
      rules.value = nextRules;
    } catch (requestError) {
      error.value = requestError.message || "Не удалось загрузить интеграции.";
    } finally {
      loading.value = false;
    }
  }

  return {
    accounts,
    budgets,
    transactions,
    integrations,
    rules,
    loading,
    error,
    loadDashboardData,
    loadReportsData,
    loadIntegrationsData,
  };
}

