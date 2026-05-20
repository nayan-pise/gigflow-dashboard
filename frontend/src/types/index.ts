export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales';
  token?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: Pagination;
}
