import { describe, expect, it } from 'vitest';
import { matchesResource, readFilters } from '../src/services/filters.js';
import { getReturnPath } from '../src/composables/useSession.js';

const resource = {
  name: 'Demo',
  summary: 'A model',
  tags: ['Sentiment'],
  type: 'dataset',
  task: 'text-classification',
  framework: 'none',
  license: 'mit',
  sizeBytes: 0,
};
describe('resource filters', () => {
  it.each([
    [100 * 1024 ** 2 - 1, 'small', true],
    [100 * 1024 ** 2, 'small', false],
    [100 * 1024 ** 2, 'medium', true],
    [1024 ** 3 - 1, 'medium', true],
    [1024 ** 3, 'medium', false],
    [1024 ** 3, 'large', true],
  ])('classifies %i bytes as %s: %s', (sizeBytes, size, expected) => {
    expect(matchesResource({ ...resource, sizeBytes }, readFilters({ size }))).toBe(expected);
  });
  it('combines tag search, type, task, license and the none framework', () => {
    const filters = readFilters({
      q: ' SENTIMENT ',
      type: 'dataset',
      task: 'text-classification',
      license: 'mit',
      framework: 'none',
    });
    expect(matchesResource(resource, filters)).toBe(true);
    expect(matchesResource({ ...resource, license: 'apache-2.0' }, filters)).toBe(false);
  });
  it('normalizes malformed query arrays and unsupported options', () => {
    expect(readFilters({ q: ['a', 'b'], size: 'huge', type: 'script' })).toEqual(readFilters({}));
  });
});
it.each([
  'https://evil.example',
  '//evil.example',
  '/login',
  '/profile/other',
  '/explore\\evil',
  null,
])('rejects unsafe return path %s', (value) => {
  expect(getReturnPath(value)).toBe('/profile');
});
it('preserves a valid resource return path', () => {
  expect(getReturnPath('/resources/2?mode=read')).toBe('/resources/2?mode=read');
});
