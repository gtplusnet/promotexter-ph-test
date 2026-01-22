import React from 'react';
import type { User } from '../../types/user.types';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import './DeleteDialog.css';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete User"
      actions={
        <>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="filled" onClick={onConfirm} className="md-button--error">
            Delete
          </Button>
        </>
      }
    >
      <div className="delete-dialog">
        <p className="delete-dialog__message">
          Are you sure you want to delete <strong>{user.fullName}</strong>?
        </p>
        <p className="delete-dialog__info">
          This is a soft delete. You can restore this user later.
        </p>
      </div>
    </Modal>
  );
};
