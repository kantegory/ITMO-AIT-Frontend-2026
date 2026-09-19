import { filterNames, matchesResource } from './services/filters.js';
import { displaySize } from './services/format.js';
import { getResources } from './services/resources.js';

const form = document.querySelector('#resource-filters');
const list = document.querySelector('#resource-list');
const template = document.querySelector('#resource-template');
const loadError = document.querySelector('#load-error');
const retry = document.querySelector('#retry-load');
let resources = [];
let loadState = 'loading';
const resultCount = document.querySelector('#result-count');
const filterCount = document.querySelector('#filter-count');
const emptyResults = document.querySelector('#empty-results');
const filterPanel = document.querySelector('#filter-panel');

const fieldLabels = Object.fromEntries(
  ['task', 'framework', 'license'].map((name) => [
    name,
    new Map(
      [...form.elements.namedItem(name).options].map((option) => [
        option.value,
        option.textContent,
      ]),
    ),
  ]),
);
const desktop = window.matchMedia('(min-width: 992px)');

function createResourceRow(resource) {
  const row = template.content.firstElementChild.cloneNode(true);
  const isDataset = resource.type === 'dataset';
  row.querySelector('img').src = `assets/icons/${isDataset ? 'database' : 'box'}.svg`;
  row
    .querySelector('.axon-resource-tile')
    .classList.toggle('axon-resource-tile--dataset', isDataset);

  const badge = row.querySelector('.axon-resource-type');
  badge.textContent = isDataset ? 'Dataset' : 'Model';
  badge.classList.toggle('axon-resource-type--dataset', isDataset);

  const heading = row.querySelector('h3');
  const link = document.createElement('a');
  link.href = `${resource.type}.html?id=${resource.id}`;
  link.textContent = resource.name;
  heading.append(link);
  row.querySelector('p').textContent = resource.summary;

  for (const name of ['task', 'framework', 'license']) {
    row.querySelector(`[data-field="${name}"]`).textContent =
      fieldLabels[name].get(resource[name]) || resource[name];
  }

  row.querySelector('[data-field="size"]').textContent = displaySize(resource.sizeBytes);

  return row;
}

function applyFilters() {
  const values = Object.fromEntries(new FormData(form));
  filterCount.textContent = `(${filterNames.filter((name) => values[name]).length})`;

  if (loadState !== 'ready') {
    return;
  }

  const visible = resources.filter((resource) => matchesResource(resource, values));
  list.replaceChildren(...visible.map(createResourceRow));

  const activeFilters = filterNames
    .filter((name) => values[name])
    .map((name) => {
      const control = form.elements.namedItem(name);

      return `${name}: ${control.selectedOptions[0].textContent}`;
    });
  const context = [values.q.trim() ? `search: ${values.q.trim()}` : '', ...activeFilters].filter(
    Boolean,
  );
  resultCount.textContent = `${visible.length} ${visible.length === 1 ? 'resource' : 'resources'}${
    context.length ? ` matching ${context.join('; ')}` : ' available'
  }.`;
  emptyResults.hidden = visible.length !== 0;
  emptyResults.textContent = resources.length
    ? 'No resources match your filters. Try another search or Reset.'
    : 'No resources are available yet. Please check back later.';
}

async function loadResources() {
  if (retry.disabled) {
    return;
  }

  const restoreFocus = document.activeElement === retry;
  retry.disabled = true;
  loadState = 'loading';
  list.setAttribute('aria-busy', 'true');
  list.replaceChildren();
  emptyResults.hidden = true;
  loadError.hidden = true;
  resultCount.textContent = 'Loading resources…';

  try {
    resources = await getResources();
    loadState = 'ready';
    applyFilters();
    retry.hidden = true;

    if (restoreFocus) {
      resultCount.focus();
    }
  } catch {
    loadState = 'error';
    resultCount.textContent = 'Resources could not be loaded. Use Retry to try again.';
    loadError.hidden = false;
    retry.hidden = false;
  } finally {
    list.setAttribute('aria-busy', 'false');
    retry.disabled = false;
  }
}

function restoreFilters() {
  const params = new URLSearchParams(window.location.search);

  for (const name of ['q', ...filterNames]) {
    const control = form.elements.namedItem(name);
    const value = params.get(name) || '';
    control.value =
      name === 'q' || [...control.options].some((option) => option.value === value) ? value : '';
  }

  applyFilters();
}

function handleSubmit(event) {
  event.preventDefault();

  const params = new URLSearchParams();

  for (const [name, value] of new FormData(form)) {
    if (value.trim()) {
      params.set(name, value.trim());
    }
  }

  history.replaceState(
    null,
    '',
    `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`,
  );
  applyFilters();
}

function handleReset(event) {
  event.preventDefault();

  for (const name of ['q', ...filterNames]) {
    form.elements.namedItem(name).value = '';
  }

  history.replaceState(null, '', `${location.pathname}${location.hash}`);
  applyFilters();
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('reset', handleReset);

window.addEventListener('popstate', restoreFilters);
desktop.addEventListener('change', () => {
  filterPanel.open = desktop.matches;
});
filterPanel.open = desktop.matches;
restoreFilters();

retry.addEventListener('click', loadResources);
loadResources();
