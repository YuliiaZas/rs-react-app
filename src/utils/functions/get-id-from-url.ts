export function getIdFromUrl(url: string): string {
  const match = url.match(/\/(\d+)(?=\D*$)/);
  return match ? match[1] : url;
}
