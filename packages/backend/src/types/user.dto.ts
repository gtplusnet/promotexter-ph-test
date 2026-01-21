import { User } from '@prisma/client';

/**
 * Data Transfer Object for User responses
 * Maps internal Prisma entity to external API representation
 * Follows Interface Segregation - clients only see what they need
 */
export interface UserDto {
  id: number;
  fullName: string;
  email: string;
  contactNumber: string | null;
  gender: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Maps a Prisma User entity to UserDto
 * Converts dates to ISO strings for consistent API responses
 */
export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    contactNumber: user.contactNumber,
    gender: user.gender,
    isDeleted: user.isDeleted,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

/**
 * Maps an array of Prisma User entities to UserDto array
 */
export function toUserDtoList(users: User[]): UserDto[] {
  return users.map(toUserDto);
}
