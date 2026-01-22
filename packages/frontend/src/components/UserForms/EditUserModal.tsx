import React, { useState, useEffect } from 'react';
import type { User, UserFormData } from '../../types/user.types';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { UserForm } from './UserForm';
import { useUpdateUser } from '../../hooks/useUserMutations';
import { validateUserForm } from '../../utils/validation';
import type { ValidationErrors } from '../../utils/validation';
import { formDataToUpdateUserData } from '../../utils/transform';

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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState<string>('');

  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        contactNumber: user.contactNumber || '',
        gender: user.gender || '',
      });
      // Reset errors when user changes
      setErrors({});
      setApiError('');
    }
  }, [user]);

  const handleClose = () => {
    setErrors({});
    setApiError('');
    onClose();
  };

  const handleUpdate = () => {
    if (!user) return;

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
    const updateData = formDataToUpdateUserData(formData);
    updateUserMutation.mutate(
      { id: user.id, data: updateData },
      {
        onSuccess: () => {
          onUpdate(formData);
          onClose();
        },
        onError: (error: any) => {
          setApiError(error.message || 'Failed to update user. Please try again.');
        },
      }
    );
  };

  const isLoading = updateUserMutation.isPending;

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit User"
      actions={
        <>
          <Button variant="text" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="filled" onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update'}
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
