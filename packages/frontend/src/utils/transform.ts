import type { UserFormData } from '../types/user.types'
import type { CreateUserData, UpdateUserData } from '../services/user.service'

export function formDataToCreateUserData(formData: UserFormData): CreateUserData {
  const data: CreateUserData = {
    fullName: formData.fullName.trim(),
    email: formData.email.trim(),
  }

  // Only include optional fields if they have values
  if (formData.contactNumber && formData.contactNumber.trim()) {
    data.contactNumber = formData.contactNumber.trim()
  }

  if (formData.gender && (formData.gender === 'male' || formData.gender === 'female')) {
    data.gender = formData.gender
  }

  return data
}

export function formDataToUpdateUserData(formData: UserFormData): UpdateUserData {
  // Same as create, since all fields are optional for update
  return formDataToCreateUserData(formData) as UpdateUserData
}
