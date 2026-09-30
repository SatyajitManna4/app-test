import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Dynamically resolves the backend server URL:
 * - If EXPO_PUBLIC_BACKEND_URL is set in environment, use it.
 * - On Web: uses http://localhost:5000
 * - On Mobile (Expo Go / Physical device / Emulator):
 *   Extracts the computer's Wi-Fi LAN IP automatically from Constants.expoConfig?.hostUri
 *   (e.g., "192.168.1.36:8081" -> "http://192.168.1.36:5000")
 * - Fallback: http://192.168.1.36:5000
 */
export const getBackendBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_BACKEND_URL) {
    return process.env.EXPO_PUBLIC_BACKEND_URL;
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:5000';
  }

  // Detect IP of the computer running Metro bundler
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:5000`;
    }
  }

  // Local Wi-Fi IP of your development computer
  return 'http://192.168.1.36:5000';
};

export const API_CONFIG = {
  // Commented out: Old employee API
  // BASE_URL: 'https://suropriyo.in',
  // API_KEY: 'sp_api_secret_key_2026',
  // ENDPOINTS: {
  //   EMPLOYEE: (id: string) => `/api/employee/${encodeURIComponent(id)}`,
  // },

  // Backend server for Contact Us and database operations
  get BACKEND_BASE_URL(): string {
    return getBackendBaseUrl();
  },
  CONTACT_ENDPOINTS: {
    SUBMIT: '/api/contact',
    LIST: '/api/contact',
  },
};
