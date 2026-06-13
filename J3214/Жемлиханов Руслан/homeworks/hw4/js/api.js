(() => {
  const App = (window.App = window.App || {});

  const API_BASE = 'http://localhost:3000';

  const getAccessToken = () => App.storage.read(App.constants.STORAGE_ACCESS_TOKEN);

  const request = async (path, options = {}, useAuth = true) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (useAuth) {
      const token = getAccessToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const message = data?.message || 'API request failed';
      throw new Error(message);
    }

    return data;
  };

  App.api = {
    async register(payload) {
      return request('/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, false);
    },

    async login(payload) {
      return request('/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, false);
    },

    async getPipelines() {
      return request('/660/pipelines');
    },

    async getPipelineDetails(id) {
      return request(`/660/pipelineDetails/${id}`);
    },

    async getNotifications() {
      return request('/660/notifications');
    },

    async getConnections() {
      return request('/660/connections');
    },

    async createConnection(payload) {
      return request('/660/connections', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },

    async deleteConnection(id) {
      return request(`/660/connections/${id}`, {
        method: 'DELETE'
      });
    },

    async getVariables() {
      return request('/660/variables');
    },

    async createVariable(payload) {
      return request('/660/variables', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },

    async deleteVariable(id) {
      return request(`/660/variables/${id}`, {
        method: 'DELETE'
      });
    }
  };
})();
