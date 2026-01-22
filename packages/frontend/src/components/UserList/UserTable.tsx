import React from 'react';
import type { User } from '../../types/user.types';
import { UserTableRow } from './UserTableRow';
import './UserTable.css';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onRestore: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  onRestore,
}) => {
  if (users.length === 0) {
    return (
      <div className="user-table-empty">
        <span className="material-symbols-outlined user-table-empty__icon">
          person_off
        </span>
        <p className="user-table-empty__text">No users found</p>
      </div>
    );
  }

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead className="user-table__header">
          <tr>
            <th className="user-table__header-cell">ID</th>
            <th className="user-table__header-cell">Full Name</th>
            <th className="user-table__header-cell">Email</th>
            <th className="user-table__header-cell">Contact Number</th>
            <th className="user-table__header-cell">Gender</th>
            <th className="user-table__header-cell">Created</th>
            <th className="user-table__header-cell">Actions</th>
          </tr>
        </thead>
        <tbody className="user-table__body">
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onRestore={onRestore}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
