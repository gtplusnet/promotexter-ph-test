import React, { useState, useEffect } from 'react';
import type { User, UserFormData } from '../../types/user.types';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { UserForm } from './UserForm';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: UserFormData) => void;
  user: User | null;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  user,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    contactNumber: '',
    gender: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        contactNumber: user.contactNumber || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleClose = () => {
    onClose();
  };

  const handleUpdate = () => {
    onUpdate(formData);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit User"
      actions={
        <>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="filled" onClick={handleUpdate}>
            Update
          </Button>
        </>
      }
    >
      <UserForm formData={formData} onChange={setFormData} />
    </Modal>
  );
};
