import React from 'react';
import type { User } from '../../types/user.types';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';

interface RestoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
}

export const RestoreDialog: React.FC<RestoreDialogProps> = ({
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
      title="Restore User"
      actions={
        <>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="filled" onClick={onConfirm}>
            Restore
          </Button>
        </>
      }
    >
      <p>
        Are you sure you want to restore <strong>{user.fullName}</strong>?
      </p>
    </Modal>
  );
};
