function normalizeApiUrl(raw: string): string {
  return raw.replace(/\/+$/, '').replace(/\/api$/i, '');
}

const API_URL = normalizeApiUrl(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
);

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fe_firme_token');
}

function extractErrorMessage(data: any, status: number): string {
  if (typeof data?.error === 'string' && data.error) return data.error;
  if (typeof data?.message === 'string' && data.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors[0]?.msg) return data.errors[0].msg;
  if (status === 401) return 'Sesión expirada. Vuelve a iniciar sesión.';
  if (status === 403) return 'No tienes permisos de administrador.';
  if (status === 413) return 'El archivo es demasiado grande.';
  return `Error ${status}`;
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

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${normalizedPath}`, fetchOptions);
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa tu conexión.');
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, res.status));
  }

  return data as T;
}

export const apiUrl = API_URL;
