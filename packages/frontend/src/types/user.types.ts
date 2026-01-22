// Frontend User Types (matches backend schema)

export type Gender = 'male' | 'female';

export interface User {
  id: number;
  fullName: string;
  email: string;
  contactNumber: string | null;
  gender: Gender | null;
  isDeleted: boolean;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export type SortByField = 'fullName' | 'email' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export interface UserFormData {
  fullName: string;
  email: string;
  contactNumber: string;
  gender: Gender | '';
}

export interface ListUsersFilters {
  page: number;
  limit: number;
  search: string;
  gender: Gender | 'all';
  includeDeleted: boolean;
  sortBy: SortByField;
  sortOrder: SortOrder;
}
