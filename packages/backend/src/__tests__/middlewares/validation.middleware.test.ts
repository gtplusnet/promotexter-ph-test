import { Request, Response } from 'express';
import { validateCreateUser, validateListUsersQuery, validateGetUserById, validateUpdateUser, validateUserIdParam } from '../../middlewares/validation.middleware';
import { createMockRequest, createMockResponse, createMockNext } from '../utils/test-helpers';

describe('validateCreateUser', () => {
  it('should call next() with valid input', () => {
    const req = createMockRequest({
      body: { fullName: 'John Doe', email: 'john@example.com' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should attach validatedCreateUserBody to request', () => {
    const req = createMockRequest({
      body: { fullName: 'John Doe', email: 'JOHN@EXAMPLE.COM' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(req.validatedCreateUserBody).toEqual({
      fullName: 'John Doe',
      email: 'john@example.com',
      contactNumber: null,
      gender: null,
    });
  });

  it('should return 400 when fullName is missing', () => {
    const req = createMockRequest({ body: { email: 'test@example.com' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 when fullName is empty string', () => {
    const req = createMockRequest({
      body: { fullName: '   ', email: 'test@example.com' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when fullName exceeds 255 characters', () => {
    const req = createMockRequest({
      body: { fullName: 'a'.repeat(256), email: 'test@example.com' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when email is missing', () => {
    const req = createMockRequest({ body: { fullName: 'John Doe' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when email format is invalid', () => {
    const req = createMockRequest({
      body: { fullName: 'John Doe', email: 'invalid-email' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when gender is invalid', () => {
    const req = createMockRequest({
      body: { fullName: 'John Doe', email: 'john@example.com', gender: 'other' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when contactNumber exceeds 50 characters', () => {
    const req = createMockRequest({
      body: {
        fullName: 'John Doe',
        email: 'john@example.com',
        contactNumber: 'a'.repeat(51),
      },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should lowercase email', () => {
    const req = createMockRequest({
      body: { fullName: 'John Doe', email: 'JOHN@EXAMPLE.COM' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(req.validatedCreateUserBody.email).toBe('john@example.com');
  });

  it('should accept valid optional gender field', () => {
    const req = createMockRequest({
      body: { fullName: 'John Doe', email: 'john@example.com', gender: 'male' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedCreateUserBody.gender).toBe('male');
  });

  it('should accept valid optional contactNumber field', () => {
    const req = createMockRequest({
      body: {
        fullName: 'John Doe',
        email: 'john@example.com',
        contactNumber: '+1234567890',
      },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateCreateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedCreateUserBody.contactNumber).toBe('+1234567890');
  });
});

describe('validateListUsersQuery', () => {
  it('should call next() with valid query parameters', () => {
    const req = createMockRequest({ query: { page: '1', limit: '10' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should attach validatedFilters to request', () => {
    const req = createMockRequest({ query: { page: '2', limit: '5' } }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(req.validatedFilters).toEqual({
      page: 2,
      limit: 5,
      includeDeleted: false,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  });

  it('should use default values when parameters are not provided', () => {
    const req = createMockRequest({ query: {} }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(req.validatedFilters.page).toBe(1);
    expect(req.validatedFilters.limit).toBe(10);
  });

  it('should return 400 when page is less than 1', () => {
    const req = createMockRequest({ query: { page: '0' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 when limit is less than 1', () => {
    const req = createMockRequest({ query: { limit: '-5' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when gender is invalid', () => {
    const req = createMockRequest({ query: { gender: 'other' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should accept valid gender values', () => {
    const req = createMockRequest({ query: { gender: 'male' } }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedFilters.gender).toBe('male');
  });

  it('should return 400 when sortBy is invalid', () => {
    const req = createMockRequest({ query: { sortBy: 'invalidField' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should accept valid sortBy values', () => {
    const req = createMockRequest({ query: { sortBy: 'fullName' } }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedFilters.sortBy).toBe('fullName');
  });

  it('should return 400 when sortOrder is invalid', () => {
    const req = createMockRequest({ query: { sortOrder: 'invalid' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should accept valid sortOrder values and lowercase them', () => {
    const req = createMockRequest({ query: { sortOrder: 'ASC' } }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedFilters.sortOrder).toBe('asc');
  });

  it('should parse includeDeleted as boolean', () => {
    const req = createMockRequest({ query: { includeDeleted: 'true' } }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(req.validatedFilters.includeDeleted).toBe(true);
  });

  it('should trim search parameter', () => {
    const req = createMockRequest({ query: { search: '  john  ' } }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(req.validatedFilters.search).toBe('john');
  });

  it('should cap limit at max value', () => {
    const req = createMockRequest({ query: { limit: '1000' } }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateListUsersQuery(req as Request, res as Response, next);

    expect(req.validatedFilters.limit).toBe(100);
  });
});

describe('validateGetUserById', () => {
  it('should call next() with valid id parameter', () => {
    const req = createMockRequest({ params: { id: '1' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateGetUserById(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should attach validatedGetUserParams to request', () => {
    const req = createMockRequest({ params: { id: '5' }, query: {} }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateGetUserById(req as Request, res as Response, next);

    expect(req.validatedGetUserParams).toEqual({
      id: 5,
      includeDeleted: false,
    });
  });

  it('should return 400 when id is not a number', () => {
    const req = createMockRequest({ params: { id: 'abc' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateGetUserById(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 when id is less than 1', () => {
    const req = createMockRequest({ params: { id: '0' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateGetUserById(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when id is negative', () => {
    const req = createMockRequest({ params: { id: '-5' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateGetUserById(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should parse includeDeleted query parameter', () => {
    const req = createMockRequest({ params: { id: '1' }, query: { includeDeleted: 'true' } }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateGetUserById(req as Request, res as Response, next);

    expect(req.validatedGetUserParams.includeDeleted).toBe(true);
  });

  it('should default includeDeleted to false when not provided', () => {
    const req = createMockRequest({ params: { id: '1' }, query: {} }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateGetUserById(req as Request, res as Response, next);

    expect(req.validatedGetUserParams.includeDeleted).toBe(false);
  });
});

describe('validateUpdateUser', () => {
  it('should call next() with valid id and body', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { fullName: 'Updated Name' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should attach validatedUpdateUserParams and validatedUpdateUserBody to request', () => {
    const req = createMockRequest({
      params: { id: '5' },
      body: { fullName: 'Updated Name', email: 'NEW@EXAMPLE.COM' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(req.validatedUpdateUserParams).toEqual({ id: 5 });
    expect(req.validatedUpdateUserBody).toEqual({
      fullName: 'Updated Name',
      email: 'new@example.com',
    });
  });

  it('should return 400 when id is not a number', () => {
    const req = createMockRequest({
      params: { id: 'abc' },
      body: { fullName: 'Test' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 when id is less than 1', () => {
    const req = createMockRequest({
      params: { id: '0' },
      body: { fullName: 'Test' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should accept partial updates with only fullName', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { fullName: 'Only Name' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedUpdateUserBody).toEqual({ fullName: 'Only Name' });
  });

  it('should accept partial updates with only email', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { email: 'only@email.com' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedUpdateUserBody).toEqual({ email: 'only@email.com' });
  });

  it('should accept partial updates with only contactNumber', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { contactNumber: '123456' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedUpdateUserBody).toEqual({ contactNumber: '123456' });
  });

  it('should accept partial updates with only gender', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { gender: 'female' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedUpdateUserBody).toEqual({ gender: 'female' });
  });

  it('should return 400 when fullName is empty string', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { fullName: '   ' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when fullName exceeds 255 characters', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { fullName: 'a'.repeat(256) },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when email format is invalid', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { email: 'invalid-email' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when gender is invalid', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { gender: 'other' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when contactNumber exceeds 50 characters', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { contactNumber: 'a'.repeat(51) },
    });
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should trim and lowercase email', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { email: 'UPDATED@EXAMPLE.COM' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(req.validatedUpdateUserBody.email).toBe('updated@example.com');
  });

  it('should trim fullName', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { fullName: '  Trimmed Name  ' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(req.validatedUpdateUserBody.fullName).toBe('Trimmed Name');
  });

  it('should allow updating multiple fields at once', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: {
        fullName: 'Full Update',
        email: 'full@update.com',
        contactNumber: '987654',
        gender: 'male',
      },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedUpdateUserBody).toEqual({
      fullName: 'Full Update',
      email: 'full@update.com',
      contactNumber: '987654',
      gender: 'male',
    });
  });

  it('should accept empty body for partial updates', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: {},
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.validatedUpdateUserBody).toEqual({});
  });

  it('should lowercase gender', () => {
    const req = createMockRequest({
      params: { id: '1' },
      body: { gender: 'FEMALE' },
    }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUpdateUser(req as Request, res as Response, next);

    expect(req.validatedUpdateUserBody.gender).toBe('female');
  });
});

describe('validateUserIdParam', () => {
  it('should call next() with valid id parameter', () => {
    const req = createMockRequest({ params: { id: '1' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateUserIdParam(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should attach validatedUserIdParam to request', () => {
    const req = createMockRequest({ params: { id: '10' } }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUserIdParam(req as Request, res as Response, next);

    expect(req.validatedUserIdParam).toEqual({ id: 10 });
  });

  it('should return 400 when id is not a number', () => {
    const req = createMockRequest({ params: { id: 'abc' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateUserIdParam(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 when id is less than 1', () => {
    const req = createMockRequest({ params: { id: '0' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateUserIdParam(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when id is negative', () => {
    const req = createMockRequest({ params: { id: '-10' } });
    const res = createMockResponse();
    const next = createMockNext();

    validateUserIdParam(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should parse string id to integer', () => {
    const req = createMockRequest({ params: { id: '42' } }) as any;
    const res = createMockResponse();
    const next = createMockNext();

    validateUserIdParam(req as Request, res as Response, next);

    expect(req.validatedUserIdParam.id).toBe(42);
    expect(typeof req.validatedUserIdParam.id).toBe('number');
  });
});
