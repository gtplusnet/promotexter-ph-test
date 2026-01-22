import React, { useState } from 'react';
import type { UserFormData } from '../../types/user.types';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { UserForm } from './UserForm';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: UserFormData) => void;
}

const initialFormData: UserFormData = {
  fullName: '',
  email: '',
  contactNumber: '',
  gender: '',
};

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  const handleCreate = () => {
    onCreate(formData);
    setFormData(initialFormData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create User"
      actions={
        <>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="filled" onClick={handleCreate}>
            Create
          </Button>
        </>
      }
    >
      <UserForm formData={formData} onChange={setFormData} />
    </Modal>
  );
};
