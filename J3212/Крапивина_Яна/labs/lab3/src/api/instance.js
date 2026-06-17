const apiURL = 'http://localhost:3000';

export default async function request(url, options = {}) {
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    if (options.data) {
        config.body = JSON.stringify(options.data);
    }

    const response = await fetch(`${apiURL}${url}`, config);

    if (!response.ok) {
        throw new Error('Ошибка сети');
    }

    const data = await response.json();
    return { data };
}