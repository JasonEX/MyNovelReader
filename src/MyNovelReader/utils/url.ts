export function getUrlHost(url: string): string {
  const a = document.createElement('a');
  a.href = url;
  return a.host;
}
