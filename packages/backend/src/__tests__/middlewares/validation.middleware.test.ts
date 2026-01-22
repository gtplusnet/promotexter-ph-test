import { Request, Response } from 'express';
import { validateCreateUser } from '../../middlewares/validation.middleware';
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
