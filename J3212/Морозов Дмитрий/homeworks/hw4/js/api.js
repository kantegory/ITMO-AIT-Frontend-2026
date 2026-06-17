const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    config => {
        console.log('Запрос:', config.method.toUpperCase(), config.url);
        return config;
    },
    error => {
        console.error('Ошибка запроса:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        console.log('Ответ:', response.status, response.config.url);
        return response;
    },
    error => {
        console.error('Ошибка ответа:', error.response?.status, error.config.url);
        return Promise.reject(error);
    }
);