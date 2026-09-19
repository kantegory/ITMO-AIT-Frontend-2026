import { getJson, requestJson } from './http.js';

export async function forkResource(source, user) {
  const existing = (await getResources(user.id)).find(
    (resource) => resource.sourceResourceId === source.id,
  );

  if (existing) {
    return existing;
  }

  const fields = [
    'type',
    'summary',
    'description',
    'task',
    'framework',
    'license',
    'sizeBytes',
    'tags',
    'metrics',
    'usageExample',
    'demoFile',
    'revision',
    'reproducibility',
  ];
  const body = Object.fromEntries(fields.map((key) => [key, source[key]]));
  Object.assign(body, {
    name: `${source.name.slice(0, 73)} (fork)`,
    userId: user.id,
    authorName: user.displayName,
    sourceResourceId: source.id,
    downloadCount: 0,
  });

  const created = await requestJson('/resources', { method: 'POST', authenticated: true, body });

  if (!Number.isSafeInteger(created?.id) || created.id <= 0 || created.type !== source.type) {
    throw new Error('Invalid fork response.');
  }

  return created;
}

export async function getResource(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Invalid resource ID.');
  }

  const resource = await getJson(`/resources/${id}`);

  if (
    !resource ||
    resource.id !== id ||
    !['model', 'dataset'].includes(resource.type) ||
    ![
      'name',
      'summary',
      'description',
      'authorName',
      'task',
      'framework',
      'license',
      'revision',
      'usageExample',
    ].every((key) => typeof resource[key] === 'string') ||
    !Number.isFinite(resource.sizeBytes) ||
    resource.sizeBytes < 0 ||
    !Array.isArray(resource.metrics) ||
    !resource.metrics.every(
      (metric) =>
        metric &&
        typeof metric.label === 'string' &&
        typeof metric.unit === 'string' &&
        (metric.value == null || typeof metric.value === 'string' || Number.isFinite(metric.value)),
    ) ||
    !resource.reproducibility ||
    typeof resource.reproducibility.environment !== 'string' ||
    !Array.isArray(resource.reproducibility.steps) ||
    !resource.reproducibility.steps.every((step) => typeof step === 'string') ||
    !(resource.reproducibility.seed == null || Number.isFinite(resource.reproducibility.seed))
  ) {
    throw new Error('Invalid resource details.');
  }

  return resource;
}

export async function getResources(userId) {
  if (userId !== undefined && (!Number.isSafeInteger(userId) || userId <= 0)) {
    throw new Error('Invalid user ID.');
  }

  const resources = await getJson(
    userId === undefined ? '/resources' : `/resources?userId=${userId}`,
  );

  if (
    !Array.isArray(resources) ||
    !resources.every(
      (resource) =>
        resource &&
        Number.isSafeInteger(resource.id) &&
        resource.id > 0 &&
        (userId === undefined || resource.userId === userId) &&
        ['model', 'dataset'].includes(resource.type) &&
        ['name', 'summary', 'task', 'framework', 'license'].every(
          (key) => typeof resource[key] === 'string',
        ) &&
        Number.isFinite(resource.sizeBytes) &&
        resource.sizeBytes >= 0,
    )
  ) {
    throw new Error('Invalid resource list.');
  }

  return resources;
}
