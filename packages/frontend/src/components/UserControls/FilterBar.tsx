import React from 'react';
import type { Gender, SortByField, SortOrder } from '../../types/user.types';
import './FilterBar.css';

interface FilterBarProps {
  gender: Gender | 'all';
  onGenderChange: (gender: Gender | 'all') => void;
  includeDeleted: boolean;
  onIncludeDeletedChange: (include: boolean) => void;
  sortBy: SortByField;
  onSortByChange: (sortBy: SortByField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  gender,
  onGenderChange,
  includeDeleted,
  onIncludeDeletedChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        <label htmlFor="gender-filter" className="filter-bar__label">
          Gender
        </label>
        <select
          id="gender-filter"
          className="filter-bar__select"
          value={gender}
          onChange={(e) => onGenderChange(e.target.value as Gender | 'all')}
        >
          <option value="all">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="filter-bar__group">
        <label htmlFor="sort-by-filter" className="filter-bar__label">
          Sort by
        </label>
        <select
          id="sort-by-filter"
          className="filter-bar__select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortByField)}
        >
          <option value="fullName">Name</option>
          <option value="email">Email</option>
          <option value="createdAt">Created</option>
          <option value="updatedAt">Updated</option>
        </select>
      </div>

      <button
        className="filter-bar__sort-toggle"
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        aria-label={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
      >
        <span className="material-symbols-outlined">
          {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
        </span>
      </button>

      <div className="filter-bar__group filter-bar__group--checkbox">
        <label htmlFor="include-deleted" className="filter-bar__checkbox-label">
          <input
            id="include-deleted"
            type="checkbox"
            className="filter-bar__checkbox"
            checked={includeDeleted}
            onChange={(e) => onIncludeDeletedChange(e.target.checked)}
          />
          <span>Include deleted</span>
        </label>
      </div>
    </div>
  );
};
