import client from './client';

export function getNotifications(userId) {
  return client.get('/notifications', { params: { userId } }).then((r) => r.data);
}
