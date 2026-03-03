const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fe_firme_token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = { ...options, headers };
  if (!options.method || options.method === 'GET') {
    fetchOptions.cache = 'no-store';
  }
  const res = await fetch(`${API_URL}${path}`, fetchOptions);

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.errors?.[0]?.msg || `Error ${res.status}`);
  }

  return data as T;
}

export const apiUrl = API_URL;
