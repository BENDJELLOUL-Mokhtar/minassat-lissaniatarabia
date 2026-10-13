export const getAssetUrl = (path: string): string => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${base}${path.startsWith('/') ? path : '/' + path}`;
};
