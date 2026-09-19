import { afterEach, expect, it, vi } from 'vitest';
import { api, requestJson } from '../src/services/http.js';
import {
  session,
  saveSession,
  clearSession,
  accountNotice,
} from '../src/composables/useSession.js';

const value = (token) => ({
  accessToken: token,
  user: { id: 1, displayName: 'Demo', email: 'demo@example.test', password: 'never-store' },
});
afterEach(() => {
  vi.restoreAllMocks();
  clearSession();
});
it('stores only the safe session fields', () => {
  saveSession(value('one'));
  expect(session.value.user.password).toBeUndefined();
  expect(sessionStorage.getItem('axonhub-session')).not.toContain('never-store');
});
it('clears the shared session after a 401', async () => {
  saveSession(value('one'));
  vi.spyOn(api, 'request').mockRejectedValue({ response: { status: 401 } });
  await expect(requestJson('/stars', { authenticated: true })).rejects.toMatchObject({
    status: 401,
  });
  expect(session.value).toBeNull();
  expect(accountNotice.value).toMatchObject({ tone: 'error' });
  expect(accountNotice.value.message).toContain('session has expired');
});
it('does not clear a new login when a stale request returns 401', async () => {
  saveSession(value('old'));

  let reject;
  vi.spyOn(api, 'request').mockImplementation(
    () =>
      new Promise((resolve, fail) => {
        reject = fail;
      }),
  );

  const pending = requestJson('/stars', { authenticated: true });
  saveSession(value('new'));
  reject({ response: { status: 401 } });
  await expect(pending).rejects.toMatchObject({ status: 401 });
  expect(session.value.accessToken).toBe('new');
  expect(accountNotice.value).toBeNull();
});
it('keeps an in-memory login if storage is blocked', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('blocked');
  });
  saveSession(value('one'));
  expect(session.value.user.id).toBe(1);
});

it('keeps a current session when a public login request fails', async () => {
  saveSession(value('current'));
  vi.spyOn(api, 'request').mockRejectedValue({ response: { status: 401 } });
  await expect(requestJson('/login', { method: 'POST' })).rejects.toMatchObject({ status: 401 });
  expect(session.value.accessToken).toBe('current');
  expect(accountNotice.value).toBeNull();
});
