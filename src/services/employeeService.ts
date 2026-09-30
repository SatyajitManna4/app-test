// import { API_CONFIG } from '../constants/api';
import { EmployeeData } from '../types/employee';

/**
 * NOTE: External Employee API has been commented out as requested.
 * The application now focuses solely on the Contact Us form and saving data into MongoDB.
 */
export class EmployeeService {
  /**
   * Fetches employee details by their employee ID code (Commented Out).
   * @param employeeId string, e.g. "EMP001"
   */
  static async getEmployeeById(employeeId: string): Promise<EmployeeData> {
    const cleanId = employeeId.trim();
    if (!cleanId) {
      throw new Error('Please enter a valid Employee ID.');
    }

    /* Commented out external API call
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLOYEE(cleanId)}`;
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
    const errorMessage = json.error || json.message || `Employee "${cleanId}" was not found.`;
    throw new Error(errorMessage);
    */

    throw new Error(`Employee API is currently disabled. Please use the Contact Us page.`);
  }
}
