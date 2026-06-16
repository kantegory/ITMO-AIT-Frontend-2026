export function useImageHelper() {
  const getImageSrc = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `/${url}`;
  };

  return { getImageSrc };
}
