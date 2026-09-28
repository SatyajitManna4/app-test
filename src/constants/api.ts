export const API_CONFIG = {
  BASE_URL: 'https://suropriyo.in',
  API_KEY: 'sp_api_secret_key_2026',
  ENDPOINTS: {
    EMPLOYEE: (id: string) => `/api/employee/${encodeURIComponent(id)}`,
  },
};
