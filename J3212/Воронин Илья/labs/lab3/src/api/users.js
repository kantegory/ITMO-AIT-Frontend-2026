import client from './client';

export function getUsers() {
  return client.get('/users').then((r) => r.data);
}
