export interface EmployeeData {
  employeeId?: string;
  employeeName: string;
  email: string;
  salary: string;
  branch: string;
}

export interface EmployeeSuccessResponse {
  status: 'success';
  data: EmployeeData;
}

export interface EmployeeErrorResponse {
  status?: string;
  error?: string;
  message?: string;
}

export type EmployeeApiResponse = EmployeeSuccessResponse | EmployeeErrorResponse;
