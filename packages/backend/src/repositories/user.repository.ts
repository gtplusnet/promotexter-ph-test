import prisma from '../lib/prisma';
import { User } from '@prisma/client';
import { FindManyUsersOptions, CreateUserBody, UpdateUserBody } from '../types/user';

export class UserRepository {
  /**
   * Find a single user by ID
   */
  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  /**
   * Find a single user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Create a new user
   */
  async create(data: CreateUserBody): Promise<User> {
    return prisma.user.create({ data });
  }

  /**
   * Update an existing user
   */
  async update(id: number, data: UpdateUserBody): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  /**
   * Soft delete a user (set isDeleted to true)
   */
  async softDelete(id: number): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  /**
   * Restore a soft-deleted user (set isDeleted to false)
   */
  async restore(id: number): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isDeleted: false },
    });
  }

  /**
   * Find multiple users with filtering, pagination, and sorting
   */
  async findMany(options: FindManyUsersOptions): Promise<User[]> {
    return prisma.user.findMany({
      skip: options.skip,
      take: options.take,
      where: options.where,
      orderBy: options.orderBy,
    });
  }

  /**
   * Count users matching the given criteria
   */
  async count(where: FindManyUsersOptions['where']): Promise<number> {
    return prisma.user.count({ where });
  }

  /**
   * Find many users and count in a single operation (transaction)
   * More efficient than separate queries
   */
  async findManyWithCount(
    options: FindManyUsersOptions
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        skip: options.skip,
        take: options.take,
        where: options.where,
        orderBy: options.orderBy,
      }),
      prisma.user.count({ where: options.where }),
    ]);

    return { users, total };
  }
}

export const userRepository = new UserRepository();
