(function () {
  const API_BASE_URLS = ["http://localhost:3000", "http://127.0.0.1:3000"];
  const TOKEN_KEY = "ai-hub-auth-token";
  let resolvedBaseUrl = API_BASE_URLS[0];

  function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
  }

  async function request(path, options) {
    const requestOptions = options || {};
    const token = getStoredToken();

    const headers = {
      "Content-Type": "application/json",
      ...(requestOptions.headers || {})
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response;
    let lastNetworkError = null;

    for (let index = 0; index < API_BASE_URLS.length; index += 1) {
      const baseUrl = API_BASE_URLS[index];
      try {
        response = await fetch(`${baseUrl}${path}`, {
          ...requestOptions,
          headers
        });
        resolvedBaseUrl = baseUrl;
        break;
      } catch (error) {
        lastNetworkError = error;
      }
    }

    if (!response) {
      const networkError = new Error(
        "Не удалось подключиться к API (http://localhost:3000 или http://127.0.0.1:3000). Запустите mock API: npm install && npm run mock-api"
      );
      networkError.cause = lastNetworkError;
      networkError.isNetworkError = true;
      throw networkError;
    }

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
      const message = payload && payload.message ? payload.message : `Ошибка запроса: ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  }

  function get(path) {
    return request(path);
  }

  function post(path, body) {
    return request(path, {
      method: "POST",
      body: JSON.stringify(body || {})
    });
  }

  window.Api = {
    get baseUrl() {
      return resolvedBaseUrl;
    },
    request,
    get,
    post
  };
})();
