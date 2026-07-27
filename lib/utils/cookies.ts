export function parseSetCookie(setCookieHeader: string): Record<string, string> {
  const parts = setCookieHeader.split(';');
  const [nameValue] = parts;
  const [name, value] = nameValue.split('=');
  return { name: name.trim(), value: value.trim() };
}
