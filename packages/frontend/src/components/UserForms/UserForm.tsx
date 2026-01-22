import React from 'react';
import type { UserFormData } from '../../types/user.types';
import { TextField } from '../Common/TextField';
import './UserForm.css';

interface UserFormProps {
  formData: UserFormData;
  onChange: (data: UserFormData) => void;
  errors?: Partial<Record<keyof UserFormData, string>>;
}

export const UserForm: React.FC<UserFormProps> = ({
  formData,
  onChange,
  errors = {},
}) => {
  const handleChange = (field: keyof UserFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...formData,
      [field]: e.target.value,
    });
  };

  return (
    <form className="user-form" onSubmit={(e) => e.preventDefault()}>
      <div className="user-form__field">
        <TextField
          label="Full Name"
          type="text"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          error={errors.fullName}
          required
        />
      </div>

      <div className="user-form__field">
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />
      </div>

      <div className="user-form__field">
        <TextField
          label="Contact Number"
          type="tel"
          value={formData.contactNumber}
          onChange={handleChange('contactNumber')}
          error={errors.contactNumber}
        />
      </div>

      <div className="user-form__field user-form__field--radio">
        <label className="user-form__label">Gender</label>
        <div className="user-form__radio-group">
          <label className="user-form__radio-label">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleChange('gender')}
              className="user-form__radio"
            />
            <span>Male</span>
          </label>
          <label className="user-form__radio-label">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleChange('gender')}
              className="user-form__radio"
            />
            <span>Female</span>
          </label>
        </div>
      </div>
    </form>
  );
};
