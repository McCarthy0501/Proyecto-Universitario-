import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, { ...options, headers });
}

export async function safeFetch(endpoint, options = {}, fallback = null) {
  try {
    const response = await apiFetch(endpoint, options);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || data.error || data.message || `Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (options.showError !== false) {
      toast.error(error.message || 'Error de conexión');
    }
    return fallback;
  }
}

export { API_BASE_URL };
