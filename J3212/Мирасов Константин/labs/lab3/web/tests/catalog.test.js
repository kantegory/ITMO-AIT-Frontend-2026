import { afterEach, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { getRankedResources } from '../src/services/resources.js';
import { getJson } from '../src/services/http.js';
import ResourceFilters from '../src/components/ResourceFilters.vue';

vi.mock('../src/services/http.js', () => ({ getJson: vi.fn(), requestJson: vi.fn() }));
afterEach(() => vi.resetAllMocks());
it('ranks by distinct star owners, breaks ties by id, and keeps unstarred resources', async () => {
  const resources = [3, 2, 1, 4].map((id) => ({
    id,
    type: 'model',
    name: `Resource ${id}`,
    summary: '',
    task: '',
    framework: '',
    license: '',
    sizeBytes: 0,
  }));
  getJson.mockImplementation(async (url) => {
    if (url === '/resources') {
      return resources;
    }

    const resourceId = Number(new URL(url, 'https://example.test').searchParams.get('resourceId'));
    const owners = { 1: [1], 2: [1, 2], 3: [1, 1], 4: [] }[resourceId];

    return owners.map((userId, index) => ({ id: index + 1, resourceId, userId }));
  });

  const ranked = await getRankedResources();
  expect(ranked.map(({ id }) => id)).toEqual([2, 1, 3, 4]);
  expect(ranked.map(({ starCount }) => starCount)).toEqual([2, 1, 1, 0]);
  expect(resources.map(({ id }) => id)).toEqual([3, 2, 1, 4]);
});
it('does not silently claim a ranking when star requests fail', async () => {
  getJson
    .mockResolvedValueOnce([
      {
        id: 1,
        type: 'model',
        name: 'Test',
        summary: '',
        task: '',
        framework: '',
        license: '',
        sizeBytes: 0,
      },
    ])
    .mockRejectedValue(new Error('Offline'));
  await expect(getRankedResources()).rejects.toThrow('Offline');
});
it('keeps collapsed filters inert and preserves drafts across toggles', async () => {
  const wrapper = mount(ResourceFilters, { props: { filters: {} } });
  const toggle = wrapper.get('button[aria-controls]');
  const panel = wrapper.get('.axon-filter-collapse');
  expect(toggle.attributes('aria-expanded')).toBe('false');
  expect(panel.attributes('inert')).toBeDefined();
  await toggle.trigger('click');
  await wrapper.get('#filter-type').setValue('dataset');
  await toggle.trigger('click');
  expect(panel.attributes('aria-hidden')).toBe('true');
  await toggle.trigger('click');
  expect(wrapper.get('#filter-type').element.value).toBe('dataset');
  await wrapper.get('form').trigger('submit');
  expect(wrapper.emitted('apply')[0][0].type).toBe('dataset');
  wrapper.unmount();
});
it('opens advanced filters for a filtered direct link', () => {
  const wrapper = mount(ResourceFilters, { props: { filters: { type: 'dataset' } } });
  expect(wrapper.get('button[aria-controls]').attributes('aria-expanded')).toBe('true');
  expect(wrapper.get('#filter-type').element.value).toBe('dataset');
  wrapper.unmount();
});
