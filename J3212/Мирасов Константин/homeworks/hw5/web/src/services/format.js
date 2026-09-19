const MEBIBYTE = 1024 ** 2;
const GIBIBYTE = 1024 ** 3;

export function displaySize(bytes) {
  return bytes >= GIBIBYTE
    ? `${Number((bytes / GIBIBYTE).toFixed(2))} GiB`
    : `${Number((bytes / MEBIBYTE).toFixed(2))} MiB`;
}
