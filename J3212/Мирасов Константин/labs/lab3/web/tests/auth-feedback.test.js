import { afterEach, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import AuthForm from '../src/components/AuthForm.vue';
import PageLayout from '../src/components/PageLayout.vue';
import { login, register } from '../src/services/auth.js';
import {
  saveSession,
  clearSession,
  session,
  accountNotice,
} from '../src/composables/useSession.js';

vi.mock('../src/services/auth.js', () => ({ login: vi.fn(), register: vi.fn() }));

const wrappers = [];

function render(component, options = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
  });
  const wrapper = mount(component, {
    attachTo: document.body,
    global: { plugins: [router] },
    ...options,
  });
  wrappers.push(wrapper);

  return { wrapper, router };
}

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  clearSession();
  vi.resetAllMocks();
  vi.useRealTimers();
});
it('shows inline required errors, focuses the first field and never submits invalid data', async () => {
  const { wrapper } = render(AuthForm, { props: { registration: true } });
  await wrapper.get('form').trigger('submit');
  expect(wrapper.get('#name-error').text()).toBe('Enter your display name.');
  expect(wrapper.get('#email-error').text()).toBe('Enter your email.');
  expect(wrapper.get('#password-error').text()).toBe('Enter your password.');
  expect(document.activeElement).toBe(wrapper.get('#display-name').element);
  await wrapper.get('#display-name').setValue('Demo');
  await wrapper.get('#email').setValue('bad-address');
  await wrapper.get('#password').setValue('short');
  await wrapper.get('form').trigger('submit');
  expect(wrapper.get('#email-error').text()).toContain('valid email');
  expect(wrapper.get('#password-error').text()).toContain('8 characters');
  expect(document.activeElement).toBe(wrapper.get('#email').element);
  expect(register).not.toHaveBeenCalled();
});
it.each([
  [401, false, 'Check your email and password.'],
  [409, true, 'This email is already registered.'],
  [undefined, false, 'Cannot reach the API. Try again.'],
])(
  'shows API error %s visibly and retains the entered email',
  async (status, registration, message) => {
    const { wrapper } = render(AuthForm, { props: { registration } });
    const error = Object.assign(new Error(message), { status });
    login.mockRejectedValue(error);
    register.mockRejectedValue(error);

    if (registration) {
      await wrapper.get('#display-name').setValue('Demo');
    }

    await wrapper.get('#email').setValue('demo@example.test');
    await wrapper.get('#password').setValue('demo-pass-123');
    await wrapper.get('form').trigger('submit');
    await flushPromises();
    expect(wrapper.get('[role="alert"]').text()).toBe(message);
    expect(wrapper.get('[role="alert"]').classes()).not.toContain('visually-hidden');
    expect(document.activeElement).toBe(wrapper.get('[role="alert"]').element);
    expect(wrapper.get('#email').element.value).toBe('demo@example.test');
    expect(wrapper.get('button').element.disabled).toBe(false);
  },
);
it('announces logout and auto-dismisses after two seconds without stealing focus', async () => {
  vi.useFakeTimers();
  saveSession({
    accessToken: 'test',
    user: { id: 1, displayName: 'Demo', email: 'demo@example.test' },
  });

  const { wrapper, router } = render(PageLayout, {
    slots: { default: '<h1 tabindex="-1">Log in</h1>' },
  });
  await wrapper.get('.axon-logout').trigger('click');
  await flushPromises();
  expect(session.value).toBeNull();
  expect(router.currentRoute.value.path).toBe('/login');
  expect(wrapper.get('.axon-account-notice [role="status"]').text()).toBe(
    'You have been logged out.',
  );
  expect(wrapper.find('.axon-account-notice [role="alert"]').exists()).toBe(false);
  expect(wrapper.get('.axon-notice-countdown').text()).toBe('2s');
  wrapper.get('h1').element.focus();
  await vi.advanceTimersByTimeAsync(1000);
  expect(wrapper.get('.axon-notice-countdown').text()).toBe('1s');
  await vi.advanceTimersByTimeAsync(900);
  expect(wrapper.get('.axon-notice-countdown').text()).toBe('0.1s');
  await vi.advanceTimersByTimeAsync(100);
  expect(wrapper.find('.axon-account-notice').exists()).toBe(false);
  expect(document.activeElement).toBe(wrapper.get('h1').element);
});
it('replaces an expired-session notice after a successful login', async () => {
  clearSession('expired');

  const { wrapper } = render(AuthForm);
  login.mockResolvedValue({
    accessToken: 'new',
    user: { id: 1, displayName: 'Demo', email: 'demo@example.test' },
  });
  await wrapper.get('#email').setValue('demo@example.test');
  await wrapper.get('#password').setValue('demo-pass-123');
  await wrapper.get('form').trigger('submit');
  await flushPromises();
  expect(accountNotice.value).toMatchObject({ tone: 'success', message: 'You are now logged in.' });
  expect(wrapper.get('#password').element.value).toBe('');
});

it('keeps errors visible and cancels the previous success timer', async () => {
  vi.useFakeTimers();
  clearSession('logout');

  const { wrapper } = render(PageLayout, { slots: { default: '<h1 tabindex="-1">Log in</h1>' } });
  await vi.advanceTimersByTimeAsync(500);
  clearSession('expired');
  await vi.advanceTimersByTimeAsync(10000);
  expect(wrapper.get('[role="alert"]').text()).toContain('session has expired');
  expect(wrapper.find('.axon-notice-countdown').exists()).toBe(false);
  await wrapper.get('[aria-label="Dismiss account notification"]').trigger('click');
  expect(accountNotice.value).toBeNull();
  expect(document.activeElement).toBe(wrapper.get('h1').element);
});
it('restarts the countdown for a repeated notice and clears timers on unmount', async () => {
  vi.useFakeTimers();
  clearSession('logout');

  const { wrapper } = render(PageLayout);
  await vi.advanceTimersByTimeAsync(500);
  clearSession('logout');
  await vi.advanceTimersByTimeAsync(1000);
  expect(wrapper.get('.axon-notice-countdown').text()).toBe('1s');
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  await vi.advanceTimersByTimeAsync(5000);
  expect(accountNotice.value.message).toBe('You have been logged out.');
});
