export function getIdFromUrl(url: string): number | null {
  const match = url.match(/\/(\d+)(?=\D*$)/);
  return match ? parseInt(match[1], 10) : null;
}
