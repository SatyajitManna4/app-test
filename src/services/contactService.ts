import { API_CONFIG } from '../constants/api';
import { ContactFormData, ContactRecord, ContactApiResponse } from '../types/contact';

export class ContactService {
  /**
   * Submit a contact inquiry to the Express + MongoDB backend
   */
  static async submitContact(formData: ContactFormData): Promise<ContactRecord> {
    const url = `${API_CONFIG.BACKEND_BASE_URL}${API_CONFIG.CONTACT_ENDPOINTS.SUBMIT}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const json: ContactApiResponse = await response.json();

      if (response.ok && json.status === 'success' && 'data' in json) {
        return json.data;
      }

      const errorMessage =
        ('message' in json && json.message) ||
        'Failed to save contact inquiry. Please try again.';
      throw new Error(errorMessage);
    } catch (err: any) {
      if (err.message && !err.message.includes('Network request failed') && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error(
        `Unable to connect to the backend server at ${API_CONFIG.BACKEND_BASE_URL}. Please ensure the backend server is running ("cd server && npm start") and your phone is on the same Wi-Fi network.`
      );
    }
  }

  /**
   * Retrieve all contact inquiries (admin/testing)
   */
  static async getContacts(): Promise<ContactRecord[]> {
    const url = `${API_CONFIG.BACKEND_BASE_URL}${API_CONFIG.CONTACT_ENDPOINTS.LIST}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const json = await response.json();

      if (response.ok && json.status === 'success' && Array.isArray(json.data)) {
        return json.data;
      }

      throw new Error(json.message || 'Failed to fetch contact inquiries.');
    } catch (err: any) {
      throw new Error(
        err.message || 'Unable to connect to the backend server.'
      );
    }
  }
}
