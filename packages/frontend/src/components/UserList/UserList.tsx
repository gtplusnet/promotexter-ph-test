import React, { useState } from 'react';
import type { User, Gender, SortByField, SortOrder } from '../../types/user.types';
import { mockUsers } from '../../data/mockUsers';
import { SearchBar } from '../UserControls/SearchBar';
import { FilterBar } from '../UserControls/FilterBar';
import { Pagination } from '../UserControls/Pagination';
import { UserTable } from './UserTable';
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
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState<Gender | 'all'>('all');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [sortBy, setSortBy] = useState<SortByField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // Filter and sort users (non-functional for now, just shows all users)
  const filteredUsers = mockUsers.filter((user) => {
    if (!includeDeleted && user.isDeleted) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar
          gender={gender}
          onGenderChange={setGender}
          includeDeleted={includeDeleted}
          onIncludeDeletedChange={setIncludeDeleted}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      </div>

      <div className="user-list__content">
        <UserTable
          users={paginatedUsers}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
          onRestore={onRestoreUser}
        />
      </div>

      <div className="user-list__pagination">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <FAB icon="add" label="Create user" onClick={onCreateUser} />
    </div>
  );
};
