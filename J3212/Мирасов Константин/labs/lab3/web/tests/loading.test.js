import { expect, it } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useLoad } from '../src/composables/useLoad.js';

it('ignores an older response after a newer reload finishes', async () => {
  const resolvers = [];
  let state;
  const wrapper = mount(
    defineComponent({
      setup() {
        state = useLoad(() => new Promise((resolve) => resolvers.push(resolve)));

        return {};
      },
      template: '<div />',
    }),
  );
  const second = state.reload();
  resolvers[1]('new');
  await second;
  resolvers[0]('old');
  await flushPromises();
  expect(state.data.value).toBe('new');
  expect(state.loading.value).toBe(false);
  wrapper.unmount();
});
it('ignores a response after its component was unmounted', async () => {
  let resolve;
  let state;
  const wrapper = mount(
    defineComponent({
      setup() {
        state = useLoad(
          () =>
            new Promise((done) => {
              resolve = done;
            }),
        );

        return {};
      },
      template: '<div />',
    }),
  );
  wrapper.unmount();
  resolve('late');
  await flushPromises();
  expect(state.data.value).toBeNull();
});
