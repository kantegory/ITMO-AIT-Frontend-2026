const API_BASE_URL = "http://localhost:3000";

function getDefaultNotificationSettings() {
    return {
        largeExpenses: false, suspiciousTransactions: false, financialLiteracy: false, weeklySummary: true
    };
}

async function requestJson(path, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${path}`, options);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function loginUser(email, password) {
    const users = await requestJson(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    if (!users.length) {
        throw new Error("Неверный email или пароль.");
    }
    return users[0];
}

export async function registerUser(email, password) {
    const existed = await requestJson(`/users?email=${encodeURIComponent(email)}`);
    if (existed.length) {
        throw new Error("Пользователь с таким email уже существует.");
    }
    return requestJson("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email, password, notificationSettings: getDefaultNotificationSettings()
        })
    });
}

export async function findUserByEmail(email) {
    const users = await requestJson(`/users?email=${encodeURIComponent(email)}`);
    if (!users.length) {
        return null;
    }
    return users[0];
}

export async function getAccountsByUser(userId) {
    return requestJson(`/accounts?userId=${encodeURIComponent(userId)}`);
}

export async function createAccount({userId, accountName, type}) {
    const existed = await requestJson(`/accounts?userId=${encodeURIComponent(userId)}&name=${encodeURIComponent(accountName)}`);
    if (existed.length) {
        throw new Error("Счёт с таким названием уже существует.");
    }
    return requestJson("/accounts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId, name: accountName, type, balance: 0
        })
    });
}

export async function getTransactionsByUser(userId) {
    return requestJson(`/transactions?userId=${encodeURIComponent(userId)}`);
}

export async function getTransactionsByFilter(userId, filters) {
    const params = new URLSearchParams();
    params.append("userId", userId);
    if (filters.period && filters.period !== "Весь период") {
        params.append("period", filters.period);
    }
    if (filters.category && filters.category !== "Все категории") {
        params.append("category", filters.category);
    }
    if (filters.account && filters.account !== "Все счета") {
        const accounts = await getAccountsByUser(userId);
        const account = accounts.find(acc => acc.name === filters.account);
        if (account) {
            params.append("accountId", account.id);
        }
    }
    return requestJson(`/transactions?${params.toString()}`);
}

export async function createTransaction({userId, accountId, date, category, comment, amount}) {
    const dateObj = new Date(date);
    const period = dateObj.toLocaleDateString("ru-RU", {month: "long", year: "numeric"});
    const formattedPeriod = period.charAt(0).toUpperCase() + period.slice(1);

    return requestJson("/transactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId, accountId, date, period: formattedPeriod, category, comment: comment || "", amount
        })
    });
}

export async function getCategories() {
    return requestJson("/categories");
}

export async function getUserNotificationSettings(userId) {
    const user = await requestJson(`/users/${encodeURIComponent(userId)}`);
    return user.notificationSettings;
}

export async function updateUserNotificationSettings(userId, notificationSettings) {
    return requestJson(`/users/${encodeURIComponent(userId)}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            notificationSettings
        })
    });
}


