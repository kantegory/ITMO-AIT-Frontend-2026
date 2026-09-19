const MEBIBYTE = 1024 ** 2;
const GIBIBYTE = 1024 ** 3;

export function displaySize(bytes) {
  return bytes >= GIBIBYTE
    ? `${Number((bytes / GIBIBYTE).toFixed(2))} GiB`
    : `${Number((bytes / MEBIBYTE).toFixed(2))} MiB`;
}

export function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => [...word][0] || '')
    .join('')
    .toUpperCase();
}
