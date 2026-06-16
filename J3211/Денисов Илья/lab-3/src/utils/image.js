export function normalizeImagePath(imagePath) {
  if (!imagePath) {
    return '';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }

  return `/${imagePath}`;
}
