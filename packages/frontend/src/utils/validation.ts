import type { UserFormData } from '../types/user.types'

export interface ValidationErrors {
  fullName?: string
  email?: string
  contactNumber?: string
  gender?: string
}

export function validateUserForm(data: UserFormData): ValidationErrors {
  const errors: ValidationErrors = {}

  // Full Name validation
  if (!data.fullName || data.fullName.trim() === '') {
    errors.fullName = 'Full name is required'
  } else if (data.fullName.length < 1 || data.fullName.length > 255) {
    errors.fullName = 'Full name must be between 1 and 255 characters'
  }

  // Email validation
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }

  // Contact Number validation (optional)
  if (data.contactNumber && data.contactNumber.length > 50) {
    errors.contactNumber = 'Contact number must not exceed 50 characters'
  }

  return errors
}
