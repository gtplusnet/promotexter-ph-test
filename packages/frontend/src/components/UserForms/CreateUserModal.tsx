import React, { useState } from 'react';
import type { UserFormData } from '../../types/user.types';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { UserForm } from './UserForm';
import { useCreateUser } from '../../hooks/useUserMutations';
import { validateUserForm } from '../../utils/validation';
import type { ValidationErrors } from '../../utils/validation';
import { formDataToCreateUserData } from '../../utils/transform';

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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState<string>('');

  const createUserMutation = useCreateUser();

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    setApiError('');
    onClose();
  };

  const handleCreate = () => {
    // Validate form
    const validationErrors = validateUserForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear previous errors
    setErrors({});
    setApiError('');

    // Transform and submit
    const createData = formDataToCreateUserData(formData);
    createUserMutation.mutate(createData, {
      onSuccess: () => {
        onCreate(formData);
        setFormData(initialFormData);
        onClose();
      },
      onError: (error: any) => {
        setApiError(error.message || 'Failed to create user. Please try again.');
      },
    });
  };

  const isLoading = createUserMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create User"
      actions={
        <>
          <Button variant="text" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="filled" onClick={handleCreate} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </>
      }
    >
      {apiError && (
        <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#fee', color: '#c00', borderRadius: '4px', fontSize: '14px' }}>
          {apiError}
        </div>
      )}
      <UserForm
        formData={formData}
        onChange={setFormData}
        errors={errors}
        disabled={isLoading}
      />
    </Modal>
  );
};
