const API_URL = 'http://localhost:3000';

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem('accessToken');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, config);

    if (!response.ok) {
        let errorMessage = 'Ошибка запроса';

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } catch {
            errorMessage = response.statusText;
        }

        throw new Error(errorMessage);
    }

    return response.json();
}

export { API_URL };