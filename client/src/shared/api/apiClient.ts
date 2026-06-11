export interface ApiMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ApiEnvelope<T> {
  data: T;
  message: string;
  meta?: ApiMeta;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const API_URL = import.meta.env.VITE_API_URL || '/api';
const CSRF_COOKIE_PATH = '/sanctum/csrf-cookie';

const getApiBase = () => {
  const trimmedUrl = API_URL.trim();

  try {
    const url = new URL(trimmedUrl);
    const pathname = url.pathname.replace(/\/+$/, '');

    if (!pathname) {
      url.pathname = '/api';
      return url.toString().replace(/\/+$/, '');
    }

    return trimmedUrl.replace(/\/+$/, '');
  } catch (_error) {
    return trimmedUrl.replace(/\/+$/, '');
  }
};

const getApiUrl = (path: string) => {
  const base = getApiBase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

const getCsrfUrl = () => {
  const base = getApiBase();

  try {
    const url = new URL(base, window.location.origin);
    url.pathname = url.pathname.replace(/\/api\/?$/, '') + CSRF_COOKIE_PATH;
    url.search = '';
    return url.toString();
  } catch (_error) {
    return CSRF_COOKIE_PATH;
  }
};

const getCookieValue = (name: string): string | null => {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
};

const isUnsafeMethod = (method?: string) => {
  return !['GET', 'HEAD', 'OPTIONS'].includes((method || 'GET').toUpperCase());
};

let csrfRequest: Promise<void> | null = null;

const ensureCsrfCookie = async () => {
  if (!csrfRequest) {
    csrfRequest = fetch(getCsrfUrl(), {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    }).then((response) => {
      if (!response.ok) {
        throw new ApiError('Unable to initialize CSRF protection', response.status);
      }
    });
  }

  try {
    await csrfRequest;
  } finally {
    csrfRequest = null;
  }
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
}

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
  retryWithFreshCsrf = true
): Promise<ApiEnvelope<T>> => {
  const { body, params, headers, ...requestOptions } = options;
  const url = new URL(getApiUrl(path), window.location.origin);
  const method = requestOptions.method || 'GET';

  if (isUnsafeMethod(method)) {
    await ensureCsrfCookie();
  }

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const requestHeaders: HeadersInit = {
    Accept: 'application/json',
    ...(isUnsafeMethod(method) && getCookieValue('XSRF-TOKEN')
      ? { 'X-XSRF-TOKEN': getCookieValue('XSRF-TOKEN') as string }
      : {}),
    ...(body !== undefined && !(body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...headers,
  };

  const response = await fetch(url.toString(), {
    ...requestOptions,
    credentials: 'include',
    headers: requestHeaders,
    body:
      body instanceof FormData
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
  });

  if (response.status === 204) {
    return { data: undefined as T, message: 'No Content' };
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 419 && retryWithFreshCsrf) {
      await ensureCsrfCookie();
      return apiRequest<T>(path, options, false);
    }

    throw new ApiError(
      payload?.message || 'Request failed',
      response.status,
      payload?.errors
    );
  }

  return payload as ApiEnvelope<T>;
};
