export function safeJSONParse<T>(data: string | null): T | null {
  try {
    return data ? JSON.parse(data) as T : null;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return null;
  }
}
