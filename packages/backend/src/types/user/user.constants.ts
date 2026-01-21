import { Gender, SortByField, SortOrder } from './user.enums';

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Derived from enums
export const VALID_GENDERS = Object.values(Gender) as [Gender, ...Gender[]];
export const VALID_SORT_FIELDS = Object.values(SortByField) as [SortByField, ...SortByField[]];
export const VALID_SORT_ORDERS = Object.values(SortOrder) as [SortOrder, ...SortOrder[]];