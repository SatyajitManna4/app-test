import { API_CONFIG } from '../constants/api';
import { EmployeeData } from '../types/employee';

export class EmployeeService {
  /**
   * Fetches employee details by their employee ID code.
   * @param employeeId string, e.g. "EMP001"
   */
  static async getEmployeeById(employeeId: string): Promise<EmployeeData> {
    const cleanId = employeeId.trim();
    if (!cleanId) {
      throw new Error('Please enter a valid Employee ID.');
    }

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLOYEE(cleanId)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
        },
      });

      const json = await response.json();

      if (response.ok && json.status === 'success' && json.data) {
        return {
          ...json.data,
          employeeId: cleanId,
        };
      }

      // Handle custom API errors or 404
      const errorMessage = json.error || json.message || `Employee "${cleanId}" was not found.`;
      throw new Error(errorMessage);
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to the Employee server. Please check your internet connection.');
    }
  }
}
