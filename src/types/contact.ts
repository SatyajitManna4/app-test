export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  subject: string;
  message: string;
}

export interface ContactRecord extends ContactFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSuccessResponse {
  status: 'success';
  message: string;
  data: ContactRecord;
}

export interface ContactErrorResponse {
  status: 'error';
  message: string;
}

export type ContactApiResponse = ContactSuccessResponse | ContactErrorResponse;
