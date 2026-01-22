import React from 'react';
import type { User } from '../../types/user.types';
import { IconButton } from '../Common/IconButton';
import './UserTableRow.css';

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onRestore: (user: User) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onEdit,
  onDelete,
  onRestore,
}) => {
  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <tr className={`user-table-row ${user.isDeleted ? 'user-table-row--deleted' : ''}`}>
      <td className="user-table-row__cell user-table-row__cell--id">{user.id}</td>
      <td className="user-table-row__cell user-table-row__cell--name">
        {user.fullName}
      </td>
      <td className="user-table-row__cell user-table-row__cell--email">
        {user.email}
      </td>
      <td className="user-table-row__cell user-table-row__cell--contact">
        {user.contactNumber || '—'}
      </td>
      <td className="user-table-row__cell user-table-row__cell--gender">
        {user.gender ? (
          <span className="user-table-row__badge">
            {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
          </span>
        ) : (
          '—'
        )}
      </td>
      <td className="user-table-row__cell user-table-row__cell--date">
        {formattedDate}
      </td>
      <td className="user-table-row__cell user-table-row__cell--actions">
        <div className="user-table-row__actions">
          {user.isDeleted ? (
            <IconButton
              icon="restore"
              label="Restore user"
              onClick={() => onRestore(user)}
            />
          ) : (
            <>
              <IconButton
                icon="edit"
                label="Edit user"
                onClick={() => onEdit(user)}
              />
              <IconButton
                icon="delete"
                label="Delete user"
                onClick={() => onDelete(user)}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
