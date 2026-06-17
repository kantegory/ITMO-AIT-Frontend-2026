const API_BASE = 'http://localhost:3001';
const HF_BASE = 'https://huggingface.co/api';

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('mh_token');
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error('Сервер или внешний API недоступен. Проверьте подключение и запуск npm start.');
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.error || `Ошибка ${response.status}`);
  }

  return data;
}

const api = {
  get: (endpoint) => request(`${API_BASE}${endpoint}`, { headers: authHeaders() }),
  post: (endpoint, body) => request(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  }),
};

function buildSearchParams(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') searchParams.set(key, value);
  });
  return searchParams.toString();
}

function mapModel(item) {
  return {
    id: item.id,
    title: item.id,
    author: item.author || item.id.split('/')[0] || 'unknown',
    description: item.description || item.cardData?.summary || 'Описание отсутствует.',
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 5) : [],
    pipelineTag: item.pipeline_tag || item.pipelineTag || 'Model',
    downloads: item.downloads || 0,
    likes: item.likes || 0,
    updatedAt: item.lastModified || '',
    license: item.cardData?.license || item.license || '—',
    source: 'huggingface',
    resourceType: 'model',
  };
}

function mapDataset(item) {
  return {
    id: item.id,
    title: item.id,
    author: item.author || item.id.split('/')[0] || 'unknown',
    description: item.description || item.cardData?.summary || 'Описание отсутствует.',
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 5) : [],
    taskCategories: item.cardData?.task_categories || [],
    downloads: item.downloads || 0,
    likes: item.likes || 0,
    updatedAt: item.lastModified || '',
    license: item.cardData?.license || item.license || '—',
    source: 'huggingface',
    resourceType: 'dataset',
  };
}

const authApi = {
  login(email, password) {
    return api.post('/auth/login', { email, password });
  },
  register(firstName, lastName, username, email, password) {
    return api.post('/auth/register', { firstName, lastName, username, email, password });
  },
  me() {
    return api.get('/auth/me');
  },
};

const hubApi = {
  async search({ query = '', type = 'all', limit = 24 } = {}) {
    const [models, datasets] = await Promise.all([
      type === 'dataset' ? Promise.resolve([]) : request(`${HF_BASE}/models?${buildSearchParams({ search: query, limit, full: 'true' })}`).then(list => list.map(mapModel)),
      type === 'model' ? Promise.resolve([]) : request(`${HF_BASE}/datasets?${buildSearchParams({ search: query, limit, full: 'true' })}`).then(list => list.map(mapDataset)),
    ]);

    return [...models, ...datasets];
  },
  async getModel(id) {
    const data = await request(`${HF_BASE}/models/${encodeURIComponent(id).replace(/%2F/g, '/')}`);
    return mapModel(data);
  },
  async getDataset(id) {
    const data = await request(`${HF_BASE}/datasets/${encodeURIComponent(id).replace(/%2F/g, '/')}`);
    return mapDataset(data);
  },
};

const commentsApi = {
  list(resourceType, resourceKey) {
    const qs = buildSearchParams({ resourceType, resourceKey });
    return api.get(`/comments?${qs}`);
  },
  add(resourceType, resourceKey, text) {
    return api.post('/comments', { resourceType, resourceKey, text });
  },
};

const favoritesApi = {
  list() {
    return api.get('/favorites');
  },
  check(resourceType, resourceKey) {
    const qs = buildSearchParams({ resourceType, resourceKey });
    return api.get(`/favorites/check?${qs}`);
  },
  toggle(payload) {
    return api.post('/favorites/toggle', payload);
  },
};

const profileApi = {
  summary() {
    return api.get('/profile/summary');
  },
};

const publicationsApi = {
  create(data) {
    return api.post('/publications', data);
  },
};
