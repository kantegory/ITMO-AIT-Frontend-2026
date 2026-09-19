import { expect, it, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useResourceActions } from '../src/composables/useResourceActions.js';
import { saveSession, clearSession } from '../src/composables/useSession.js';
import * as social from '../src/services/social.js';
import DiscussionForm from '../src/components/DiscussionForm.vue';

vi.mock('../src/services/social.js', () => ({
  getStars: vi.fn(),
  getSubscriptions: vi.fn(),
  addStar: vi.fn(),
  removeStar: vi.fn(),
  setSubscription: vi.fn(),
}));
afterEach(() => {
  vi.resetAllMocks();
  clearSession();
});
it('blocks duplicate star posts and requires reload after a failed write', async () => {
  saveSession({
    accessToken: 'test',
    user: { id: 17, displayName: 'Test', email: 'test@example.test' },
  });
  social.getStars.mockResolvedValue([]);
  social.getSubscriptions.mockResolvedValue([]);

  let reject;
  social.addStar.mockImplementation(
    () =>
      new Promise((resolve, fail) => {
        reject = fail;
      }),
  );

  let actions;
  const wrapper = mount(
    defineComponent({
      setup() {
        actions = useResourceActions(987);

        return {};
      },
      template: '<div />',
    }),
  );
  await flushPromises();

  const first = actions.toggleStar();
  await flushPromises();
  await actions.toggleStar();
  expect(social.addStar).toHaveBeenCalledTimes(1);
  reject(new Error('Network failed'));
  await first;
  expect(actions.state.value.starPending).toBe(false);
  expect(actions.state.value.loaded).toBe(false);
  expect(actions.state.value.error).toContain('Network failed');
  await actions.toggleStar();
  expect(social.addStar).toHaveBeenCalledTimes(1);
  wrapper.unmount();
});
it('preserves a comment draft after failure and resets it after successful retry', async () => {
  const save = vi.fn().mockRejectedValueOnce(new Error('Try again')).mockResolvedValueOnce({});
  const wrapper = mount(DiscussionForm, { props: { save } });
  await wrapper.get('textarea').setValue('<img src=x onerror=alert(1)>');
  await wrapper.get('form').trigger('submit');
  await flushPromises();
  expect(wrapper.get('textarea').element.value).toBe('<img src=x onerror=alert(1)>');
  expect(wrapper.find('img').exists()).toBe(false);
  await wrapper.get('form').trigger('submit');
  await flushPromises();
  expect(wrapper.get('textarea').element.value).toBe('');
  expect(wrapper.emitted('saved')).toHaveLength(1);
  wrapper.unmount();
});
