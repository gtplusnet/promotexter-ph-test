import React, { useState } from 'react';
import type { User, Gender, SortByField, SortOrder, ListUsersFilters } from '../../types/user.types';
import { useUsers } from '../../hooks/useUsers';
import { SearchBar } from '../UserControls/SearchBar';
import { FilterBar } from '../UserControls/FilterBar';
import { Pagination } from '../UserControls/Pagination';
import { UserTable } from './UserTable';
import { UserTableSkeleton } from './UserTableSkeleton';
import { UserTableError } from './UserTableError';
import { FAB } from '../Common/FAB';
import { Button } from '../Common/Button';
import './UserList.css';

interface UserListProps {
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onRestoreUser: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({
  onCreateUser,
  onEditUser,
  onDeleteUser,
  onRestoreUser,
}) => {
  const [filters, setFilters] = useState<ListUsersFilters>({
    page: 1,
    limit: 10,
    search: '',
    gender: 'all',
    includeDeleted: false,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, isError, error, refetch } = useUsers(filters);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleGenderChange = (gender: Gender | 'all') => {
    setFilters((prev) => ({ ...prev, gender, page: 1 }));
  };

  const handleIncludeDeletedChange = (includeDeleted: boolean) => {
    setFilters((prev) => ({ ...prev, includeDeleted, page: 1 }));
  };

  const handleSortByChange = (sortBy: SortByField) => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  const handleSortOrderChange = (sortOrder: SortOrder) => {
    setFilters((prev) => ({ ...prev, sortOrder, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const users = data?.users ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="user-list">
      <header className="user-list__header">
        <div className="user-list__header-content">
          <div>
            <h1 className="user-list__title">User Management</h1>
            <p className="user-list__subtitle">
              Manage user accounts and permissions
            </p>
          </div>
          <Button variant="filled" onClick={onCreateUser}>
            <span className="material-symbols-outlined">add</span>
            Add User
          </Button>
        </div>
      </header>

      <div className="user-list__controls">
        <SearchBar value={filters.search} onChange={handleSearchChange} />
        <FilterBar
          gender={filters.gender}
          onGenderChange={handleGenderChange}
          includeDeleted={filters.includeDeleted}
          onIncludeDeletedChange={handleIncludeDeletedChange}
          sortBy={filters.sortBy}
          onSortByChange={handleSortByChange}
          sortOrder={filters.sortOrder}
          onSortOrderChange={handleSortOrderChange}
        />
      </div>

      <div className="user-list__content">
        {isLoading ? (
          <table className="user-table">
            <thead className="user-table__head">
              <tr>
                <th className="user-table__header">ID</th>
                <th className="user-table__header">Full Name</th>
                <th className="user-table__header">Email</th>
                <th className="user-table__header">Contact</th>
                <th className="user-table__header">Gender</th>
                <th className="user-table__header">Created</th>
                <th className="user-table__header">Actions</th>
              </tr>
            </thead>
            <tbody>
              <UserTableSkeleton />
            </tbody>
          </table>
        ) : isError ? (
          <table className="user-table">
            <thead className="user-table__head">
              <tr>
                <th className="user-table__header">ID</th>
                <th className="user-table__header">Full Name</th>
                <th className="user-table__header">Email</th>
                <th className="user-table__header">Contact</th>
                <th className="user-table__header">Gender</th>
                <th className="user-table__header">Created</th>
                <th className="user-table__header">Actions</th>
              </tr>
            </thead>
            <tbody>
              <UserTableError error={error as Error} onRetry={() => refetch()} />
            </tbody>
          </table>
        ) : (
          <UserTable
            users={users}
            onEdit={onEditUser}
            onDelete={onDeleteUser}
            onRestore={onRestoreUser}
          />
        )}
      </div>

      {!isLoading && !isError && (
        <div className="user-list__pagination">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <FAB icon="add" label="Create user" onClick={onCreateUser} />
    </div>
  );
};
