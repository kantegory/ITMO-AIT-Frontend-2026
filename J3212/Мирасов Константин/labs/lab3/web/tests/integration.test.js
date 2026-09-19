import { beforeAll, afterAll, expect, it } from 'vitest';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { api } from '../src/services/http.js';
import { clearSession, session, saveSession } from '../src/composables/useSession.js';
import { login } from '../src/services/auth.js';
import { getResource, forkResource } from '../src/services/resources.js';
import { getComments, editComment, deleteComment, postComment } from '../src/services/social.js';
import AuthForm from '../src/components/AuthForm.vue';
import AppHeader from '../src/components/AppHeader.vue';
import ResourceActions from '../src/components/ResourceActions.vue';
import ProfileView from '../src/views/ProfileView.vue';
import DiscussionList from '../src/components/DiscussionList.vue';

let server;
let directory;
let closed;
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
});
beforeAll(async () => {
  directory = mkdtempSync(path.join(tmpdir(), 'axon-vue-'));
  server = spawn(process.execPath, [path.resolve('../mock/server.cjs')], {
    env: { ...process.env, AXON_DB_PATH: path.join(directory, 'db.json'), AXON_PORT: '3004' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  closed = new Promise((resolve) => server.once('close', resolve));
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Test API startup timeout')), 10000);
    server.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.stdout.on('data', (chunk) => {
      if (chunk.toString().includes('AxonHub mock:')) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
  api.defaults.baseURL = 'http://127.0.0.1:3004';
  api.defaults.adapter = 'http';
  await router.push('/register');
}, 15000);
afterAll(async () => {
  clearSession();
  server?.kill();

  if (closed) {
    await closed;
  }

  if (directory) {
    rmSync(directory, { recursive: true, force: true });
  }
});

async function settleUntil(condition) {
  for (let i = 0; i < 100; i++) {
    await flushPromises();

    if (condition()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  throw new Error('UI state did not settle');
}

it('runs registration, login, relations, profile, comment CRUD and fork against a disposable API', async () => {
  const form = mount(AuthForm, { props: { registration: true }, global: { plugins: [router] } });
  await form.get('#display-name').setValue('Vue Test');
  await form.get('#email').setValue('vue-test@example.test');
  await form.get('#password').setValue('demo-pass-123');
  await form.get('form').trigger('submit');
  await settleUntil(() => !!session.value);
  expect(session.value.user.displayName).toBe('Vue Test');
  expect(sessionStorage.getItem('axonhub-session')).not.toContain('demo-pass-123');
  form.unmount();
  clearSession();
  saveSession(await login('vue-test@example.test', 'demo-pass-123'));

  const user = session.value.user;
  const header = mount(AppHeader, { global: { plugins: [router] } });
  expect(header.get('.axon-account-link').text()).toContain('Vue Test');
  expect(header.get('.axon-avatar').text()).toBe('VT');
  expect(header.text()).not.toContain('Signed in');
  header.unmount();

  const actions = mount(ResourceActions, {
    props: { resourceId: 1 },
    global: { plugins: [router] },
  });
  await settleUntil(() => !actions.get('button[aria-label="Star"]').element.disabled);
  await actions.get('button[aria-label="Star"]').trigger('click');
  await settleUntil(
    () => actions.get('button[aria-label="Star"]').attributes('aria-pressed') === 'true',
  );
  await actions.get('button[aria-label="Subscribe"]').trigger('click');
  await settleUntil(
    () => actions.get('button[aria-label="Subscribe"]').attributes('aria-pressed') === 'true',
  );
  expect(actions.get('.axon-star-button').text()).not.toContain('Star');
  expect(actions.get('.axon-action-count').text()).toBe('1');
  expect(actions.get('[role="status"]').classes()).toContain('visually-hidden');
  expect(actions.get('.axon-subscription-check').text()).toBe('✓');

  const second = mount(ResourceActions, {
    props: { resourceId: 1 },
    global: { plugins: [router] },
  });
  expect(second.get('button[aria-label="Star"]').attributes('aria-pressed')).toBe('true');

  const source = await getResource(1);
  const fork = await forkResource(source, user);
  expect((await forkResource(source, user)).id).toBe(fork.id);
  expect(fork.sourceResourceId).toBe(1);

  const profile = mount(ProfileView, { global: { plugins: [router] } });
  await settleUntil(
    () =>
      profile.text().includes('Sentiment Mini (fork)') && profile.text().includes('Sentiment Mini'),
  );
  expect(profile.findAll('li.axon-resource-row')).toHaveLength(2);
  expect(profile.get('.axon-profile-card').text()).toContain('Your profile');
  expect(profile.get('.axon-profile-email').text()).toContain('vue-test@example.test');

  const comment = await postComment(1, user, '<script>test</script>');
  expect((await getComments(1)).find((row) => row.id === comment.id).body).toBe(
    '<script>test</script>',
  );
  await editComment(comment.id, 'Updated');
  expect((await getComments(1)).find((row) => row.id === comment.id).body).toBe('Updated');

  const discussion = mount(DiscussionList, {
    props: { resourceId: 1 },
    global: { plugins: [router] },
  });
  await settleUntil(() => discussion.text().includes('Updated'));

  const button = (text) => discussion.findAll('button').find((node) => node.text() === text);
  await button('Edit comment').trigger('click');
  await discussion.find('textarea').setValue('UI edit');
  await discussion.find('form').trigger('submit');
  await settleUntil(
    () => discussion.text().includes('UI edit') && !discussion.text().includes('Cancel edit'),
  );
  await button('Delete comment').trigger('click');
  await button('Cancel delete').trigger('click');
  expect(discussion.text()).toContain('UI edit');
  await button('Delete comment').trigger('click');
  await button('Confirm delete').trigger('click');
  await settleUntil(() => !discussion.text().includes('UI edit'));
  discussion.unmount();
  expect((await getComments(1)).some((row) => row.id === comment.id)).toBe(false);
  await actions.get('button[aria-label="Subscribe"]').trigger('click');
  await settleUntil(
    () => actions.get('button[aria-label="Subscribe"]').attributes('aria-pressed') === 'false',
  );
  actions.unmount();
  second.unmount();
  profile.unmount();
}, 15000);
