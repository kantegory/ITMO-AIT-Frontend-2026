const API_URL = 'http://localhost:3000';

function getHeaders(token) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

export function request(path, options = {}, token = null) {
    return fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...getHeaders(token),
            ...options.headers
        }
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Сервер вернул ошибку');
        }

        return response.json();
    });
}

export function loadApiData(token) {
    return Promise.all([
        request('/projects', {}, token),
        request('/workers', {}, token),
        request('/tasks', {}, token)
    ]).then(([projects, workers, tasks]) => {
        return {
            projects,
            workers,
            tasks
        };
    });
}
