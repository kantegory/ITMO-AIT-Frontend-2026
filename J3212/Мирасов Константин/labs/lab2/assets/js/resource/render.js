import { displaySize } from '../services/format.js';

const labels = {
  'text-classification': 'Text classification',
  'image-classification': 'Image classification',
  translation: 'Translation',
  pytorch: 'PyTorch',
  tensorflow: 'TensorFlow',
  'scikit-learn': 'scikit-learn',
  none: 'Not applicable',
  'apache-2.0': 'Apache-2.0',
  mit: 'MIT',
  'cc-by-4.0': 'CC-BY-4.0',
};

export function setText(selector, value) {
  document.querySelector(selector).textContent = value;
}

function renderPairs(selector, pairs) {
  const rows = pairs.map(([label, value]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');

    term.textContent = label;
    description.textContent = value ?? 'Not provided';
    row.append(term, description);

    return row;
  });

  document.querySelector(selector).replaceChildren(...rows);
}

export function renderResource(resource) {
  document.title = `${resource.name} · AxonHub`;
  setText('#resource-name', resource.name);
  setText('#resource-summary', resource.summary);
  setText('#author-name', resource.authorName);
  setText('#resource-description', resource.description);
  setText('#resource-usage', resource.usageExample);

  const size = displaySize(resource.sizeBytes);

  renderPairs('#resource-metadata', [
    ['Task', labels[resource.task] ?? resource.task],
    ['Framework', labels[resource.framework] ?? resource.framework],
    ['License', labels[resource.license] ?? resource.license],
    ['Size', size],
    ['Version', resource.revision],
  ]);
  renderPairs(
    '#resource-metrics',
    resource.metrics.length
      ? resource.metrics.map((metric) => [
          metric.label,
          metric.value == null ? null : `${metric.value}${metric.unit ? ` ${metric.unit}` : ''}`,
        ])
      : [['Metrics', null]],
  );
  renderPairs('#resource-reproduction', [
    ['Environment', resource.reproducibility.environment],
    ['Revision', resource.revision],
    ['Seed', resource.reproducibility.seed],
  ]);
  document.querySelector('#resource-steps').replaceChildren(
    ...resource.reproducibility.steps.map((step) => {
      const item = document.createElement('li');

      item.textContent = step;

      return item;
    }),
  );

  const hasDownload = resource.demoFile === 'resource-manifest';

  document.querySelector('#resource-download').hidden = !hasDownload;
  document.querySelector('#download-unavailable').hidden = hasDownload;
  setText(
    '#resource-downloads',
    `Demo downloads: ${
      Number.isSafeInteger(resource.downloadCount) && resource.downloadCount >= 0
        ? resource.downloadCount
        : 'Not provided'
    }`,
  );
}
