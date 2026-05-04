import client from './client';

export function getDiscussions(projectId) {
  return client.get('/discussions', { params: { projectId } }).then((r) => r.data);
}

export function addDiscussion(projectId, authorName, text) {
  return client
    .post('/discussions', {
      projectId,
      authorName,
      text,
      createdAt: new Date().toISOString(),
    })
    .then((r) => r.data);
}
