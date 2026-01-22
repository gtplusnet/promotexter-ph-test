import { UserService } from '../../services/user.service';
import { ApiError } from '../../middlewares/error.middleware';
import { createMockUser, createMockRepository } from '../utils/test-helpers';

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
});
