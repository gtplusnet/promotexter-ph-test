import prisma from '../lib/prisma';
import { User } from '@prisma/client';
import { FindManyUsersOptions } from '../types/user';

export class UserRepository {
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
