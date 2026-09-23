const getBaseUrl = () => {
  try {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl) return envUrl.replace(/\/$/, '');
  } catch (e) {
    console.warn('VITE_API_BASE_URL not found');
  }
  return 'http://localhost:8000';
};

const BASE_URL = getBaseUrl();

export const saveTokens = (data) => {
  const payload = data?.data || data?.result || data?.tokens || data || {};

  
  const accessToken = payload.access_token || payload.accessToken || payload.access || payload.token;
  const refreshToken = payload.refresh_token || payload.refreshToken || payload.refresh;

  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    return true;
  }
  return false;
};

export const getAccessToken = () => localStorage.getItem('access_token');

export const clearAuthState = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('upolobdhi-user');
};


const formatError = (data, fallback) => {
  if (data?.error?.message) return data.error.message;
  if (Array.isArray(data?.detail)) {
    return data.detail.map(err => {
      const field = err.loc?.slice(-1)[0] || 'Field';
      return `${field}: ${err.msg}`;
    }).join('. ');
  }

  return data?.detail || data?.message || fallback;
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.access_token) return false;

    localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
    return true;
  } catch {
    return false;
  }
};


export const apiRequest = async (endpoint, options = {}, retryOnUnauthorized = true) => {
  const { responseType = 'json', ...requestOptions } = options;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${path}`;

  const headers = { 'Accept': 'application/json', ...requestOptions.headers };
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let body = requestOptions.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, { ...requestOptions, headers, body });

    
    if (response.status === 204) return null;

    
    if (response.status === 401 && retryOnUnauthorized) {
      if (await refreshAccessToken()) {
        return apiRequest(endpoint, options, false);
      }
    }

    const data = response.ok && responseType === 'blob'
      ? await response.blob()
      : await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(formatError(data, `Error ${response.status}: ${response.statusText}`));
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};
