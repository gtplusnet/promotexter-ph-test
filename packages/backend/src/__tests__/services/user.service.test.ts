import { UserService } from '../../services/user.service';
import { ApiError } from '../../middlewares/error.middleware';
import { createMockUser, createMockRepository } from '../utils/test-helpers';
import { ListUsersFilters, SortByField, SortOrder, Gender } from '../../types/user';

describe('UserService', () => {
  describe('createUser', () => {
    it('should create user when email is unique', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createMockUser({ id: 1 }));
      const service = new UserService(mockRepository as any);
      const userData = { fullName: 'John Doe', email: 'john@example.com' };

      const result = await service.createUser(userData);

      expect(result.id).toBe(1);
    });

    it('should call repository.findByEmail with correct email', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createMockUser());
      const service = new UserService(mockRepository as any);

      await service.createUser({ fullName: 'Test', email: 'test@example.com' });

      expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should call repository.create with correct data', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createMockUser());
      const service = new UserService(mockRepository as any);
      const userData = { fullName: 'John Doe', email: 'john@example.com' };

      await service.createUser(userData);

      expect(mockRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should throw ApiError with EMAIL_EXISTS when email already exists', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findByEmail.mockResolvedValue(createMockUser());
      const service = new UserService(mockRepository as any);

      await expect(
        service.createUser({ fullName: 'Test', email: 'existing@email.com' })
      ).rejects.toThrow(ApiError);
    });

    it('should throw error with correct message when email exists', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findByEmail.mockResolvedValue(createMockUser());
      const service = new UserService(mockRepository as any);
      await expect(
        service.createUser({ fullName: 'Test', email: 'existing@email.com' })
      ).rejects.toThrow('A user with this email already exists');
    });

    it('should not call repository.create when email already exists', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findByEmail.mockResolvedValue(createMockUser());
      const service = new UserService(mockRepository as any);

      try {
        await service.createUser({ fullName: 'Test', email: 'existing@email.com' });
      } catch (e) {
        // Expected to throw
      }

      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('listUsers', () => {
    it('should return users and pagination info', async () => {
      const mockRepository = createMockRepository();
      const mockUsers = [createMockUser({ id: 1 }), createMockUser({ id: 2 })];
      mockRepository.findManyWithCount.mockResolvedValue({ users: mockUsers, total: 2 });
      const service = new UserService(mockRepository as any);
      const filters: ListUsersFilters = { page: 1, limit: 10, sortBy: SortByField.CREATED_AT, sortOrder: SortOrder.DESC, includeDeleted: false };

      const result = await service.listUsers(filters);

      expect(result.users).toEqual(mockUsers);
      expect(result.pagination.total).toBe(2);
    });

    it('should call repository.findManyWithCount with correct options', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findManyWithCount.mockResolvedValue({ users: [], total: 0 });
      const service = new UserService(mockRepository as any);
      const filters: ListUsersFilters = { page: 2, limit: 5, sortBy: SortByField.CREATED_AT, sortOrder: SortOrder.DESC, includeDeleted: false };

      await service.listUsers(filters);

      expect(mockRepository.findManyWithCount).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should exclude deleted users by default', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findManyWithCount.mockResolvedValue({ users: [], total: 0 });
      const service = new UserService(mockRepository as any);
      const filters: ListUsersFilters = { page: 1, limit: 10, sortBy: SortByField.CREATED_AT, sortOrder: SortOrder.DESC, includeDeleted: false };

      await service.listUsers(filters);

      expect(mockRepository.findManyWithCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isDeleted: false } })
      );
    });

    it('should include deleted users when includeDeleted is true', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findManyWithCount.mockResolvedValue({ users: [], total: 0 });
      const service = new UserService(mockRepository as any);
      const filters: ListUsersFilters = { page: 1, limit: 10, sortBy: SortByField.CREATED_AT, sortOrder: SortOrder.DESC, includeDeleted: true };

      await service.listUsers(filters);

      expect(mockRepository.findManyWithCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} })
      );
    });

    it('should filter by gender when provided', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findManyWithCount.mockResolvedValue({ users: [], total: 0 });
      const service = new UserService(mockRepository as any);
      const filters: ListUsersFilters = { page: 1, limit: 10, sortBy: SortByField.CREATED_AT, sortOrder: SortOrder.DESC, includeDeleted: false, gender: 'male' as Gender };

      await service.listUsers(filters);

      expect(mockRepository.findManyWithCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isDeleted: false, gender: 'male' } })
      );
    });

    it('should search by fullName and email when search is provided', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findManyWithCount.mockResolvedValue({ users: [], total: 0 });
      const service = new UserService(mockRepository as any);
      const filters: ListUsersFilters = { page: 1, limit: 10, sortBy: SortByField.CREATED_AT, sortOrder: SortOrder.DESC, includeDeleted: false, search: 'john' };

      await service.listUsers(filters);

      expect(mockRepository.findManyWithCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isDeleted: false,
            OR: [
              { fullName: { contains: 'john' } },
              { email: { contains: 'john' } },
            ],
          },
        })
      );
    });

    it('should calculate pagination info correctly', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findManyWithCount.mockResolvedValue({ users: [], total: 25 });
      const service = new UserService(mockRepository as any);
      const filters: ListUsersFilters = { page: 2, limit: 10, sortBy: SortByField.CREATED_AT, sortOrder: SortOrder.DESC, includeDeleted: false };

      const result = await service.listUsers(filters);

      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
      });
    });

    it('should sort by specified field and order', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findManyWithCount.mockResolvedValue({ users: [], total: 0 });
      const service = new UserService(mockRepository as any);
      const filters: ListUsersFilters = { page: 1, limit: 10, sortBy: SortByField.FULL_NAME, sortOrder: SortOrder.ASC, includeDeleted: false };

      await service.listUsers(filters);

      expect(mockRepository.findManyWithCount).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { fullName: 'asc' } })
      );
    });
  });

  describe('getUserById', () => {
    it('should return user when found and not deleted', async () => {
      const mockRepository = createMockRepository();
      const mockUser = createMockUser({ id: 1, isDeleted: false });
      mockRepository.findById.mockResolvedValue(mockUser);
      const service = new UserService(mockRepository as any);

      const result = await service.getUserById(1, false);

      expect(result).toEqual(mockUser);
    });

    it('should call repository.findById with correct id', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findById.mockResolvedValue(createMockUser());
      const service = new UserService(mockRepository as any);

      await service.getUserById(5, false);

      expect(mockRepository.findById).toHaveBeenCalledWith(5);
    });

    it('should throw USER_NOT_FOUND when user does not exist', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findById.mockResolvedValue(null);
      const service = new UserService(mockRepository as any);

      await expect(service.getUserById(999, false)).rejects.toThrow(ApiError);
    });

    it('should throw error with correct message when user not found', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findById.mockResolvedValue(null);
      const service = new UserService(mockRepository as any);

      await expect(service.getUserById(999, false)).rejects.toThrow('User with ID 999 not found');
    });

    it('should throw USER_NOT_FOUND when user is deleted and includeDeleted is false', async () => {
      const mockRepository = createMockRepository();
      mockRepository.findById.mockResolvedValue(createMockUser({ isDeleted: true }));
      const service = new UserService(mockRepository as any);

      await expect(service.getUserById(1, false)).rejects.toThrow(ApiError);
    });

    it('should return deleted user when includeDeleted is true', async () => {
      const mockRepository = createMockRepository();
      const mockUser = createMockUser({ id: 1, isDeleted: true });
      mockRepository.findById.mockResolvedValue(mockUser);
      const service = new UserService(mockRepository as any);

      const result = await service.getUserById(1, true);

      expect(result).toEqual(mockUser);
    });
  });
});
