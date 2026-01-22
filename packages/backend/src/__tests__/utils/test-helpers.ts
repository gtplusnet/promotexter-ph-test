import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

/**
 * Mock User factory
 * Creates a complete User object with sensible defaults
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  fullName: 'John Doe',
  email: 'john@example.com',
  contactNumber: null,
  gender: null,
  isDeleted: false,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

/**
 * Mock Repository factory
 * Creates a mock UserRepository with all methods as jest.fn()
 */
export const createMockRepository = () => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
  hardDelete: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn(),
  findManyWithCount: jest.fn(),
});

/**
 * Mock Express Request factory
 */
export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  params: {},
  query: {},
  body: {},
  ...overrides,
});

/**
 * Mock Express Response factory
 * Returns a chainable mock response object
 */
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Mock NextFunction factory
 */
export const createMockNext = (): NextFunction => jest.fn();
