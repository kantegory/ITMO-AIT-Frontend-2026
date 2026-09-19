export const filterNames = ['type', 'task', 'license', 'size', 'framework'];

const MEBIBYTE = 1024 ** 2;
const GIBIBYTE = 1024 ** 3;

function matchesSize(bytes, size) {
  if (size === 'small') {
    return bytes < 100 * MEBIBYTE;
  }

  if (size === 'medium') {
    return bytes >= 100 * MEBIBYTE && bytes < GIBIBYTE;
  }

  if (size === 'large') {
    return bytes >= GIBIBYTE;
  }

  return true;
}

export function matchesResource(resource, values) {
  const query = values.q.trim().toLowerCase();
  const text = `${resource.name} ${resource.summary}`.toLowerCase();

  return (
    text.includes(query) &&
    filterNames.every(
      (name) =>
        !values[name] ||
        (name === 'size'
          ? matchesSize(resource.sizeBytes, values.size)
          : resource[name] === values[name]),
    )
  );
}
