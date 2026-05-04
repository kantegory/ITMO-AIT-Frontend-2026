import client from './client';

export function getProjects() {
  return client.get('/projects').then((r) => r.data);
}

export function getProject(id) {
  return client.get(`/projects/${id}`).then((r) => r.data);
}

export function addProject(name, description) {
  return client
    .post('/projects', {
      name,
      description: description || '0 задач · 0 участников',
    })
    .then((r) => r.data);
}
