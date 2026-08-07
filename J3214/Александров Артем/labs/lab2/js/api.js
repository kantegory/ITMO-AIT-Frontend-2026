const API_URL = 'http://localhost:3000';

async function getUserByEmail(email) {
    try {
        const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);

        if (!response.ok) throw new Error('faild to find the user');
        const users = await response.json();
        return users[0] || null;

    } catch(error) {

        console.error('error getUserByEmail: ', error)
        return null;
    }
}

async function createUser(userData) {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('failed to register user');
        return await response.json();

    } catch(error) {

        console.error('error createUser:', error);
        return null;
    }
}

async function getUserAccounts(userId) {
    try {
        const response = await fetch(`${API_URL}/accounts?userId=${userId}`);

        if (!response.ok) throw new Error('failed to upload accounts');
        return await response.json();

    } catch (error) {

        console.error('error getUserAccounts:', error);
        return [];
    }
}

async function getTransactions(userId) {
    try {
        // тернарный оператор для гибкости получения транзакций (конкретные / все)
        const url = userId ? `${API_URL}/transactions?userId=${userId}` : `${API_URL}/transactions`;
        const response = await fetch(url);
            
        if (!response.ok) throw new Error('failed to upload transactions');
        return await response.json();

    } catch (error) {

        console.error('error getTransactions:', error);
        return [];
    }
}

async function createTransaction(transactionData) {
    try {

        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) throw new Error('failed to create transaction');
        return await response.json();

    } catch(error) {

        console.error('error createTransaction:', error);
        return null;
    }
}