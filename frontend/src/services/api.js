import { API_BASE_URL } from '../utils/constants';
import { mockBackend } from './mockBackend';

class ApiService {
  getToken() {
    return localStorage.getItem('wildsense_token');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      // Handle CSV downloads or non-JSON
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/csv')) {
        return await res.text();
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }
      return data;
    } catch (err) {
      // Automatic fallback to embedded mock data for GitHub Pages / Static Hosting
      console.warn(`[WILD SENSE] Live backend unavailable for [${options.method || 'GET'} ${endpoint}]. Running in embedded standalone mode.`);
      const mockResult = mockBackend.handle(endpoint, options);
      return mockResult;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const fullEndpoint = query ? `${endpoint}?${query}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET' });
  }

  post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();
export default api;
