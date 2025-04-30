import * as userModel from '../path-to-your-model';
import db from '../db/connection';
import bcrypt from 'bcryptjs';

jest.mock('../db/connection');
jest.mock('bcryptjs');

describe('User Model Functions', () => {

  describe('getUserData', () => {
    it('should return user data successfully', async () => {
      const mockData = [{ email: 'test@example.com', first_name: 'John', last_name: 'Doe', mobile_number: '1234567890' }];
      db.query.mockImplementation((sql, params, callback) => callback(null, mockData));

      const result = await userModel.getUserData(1);
      expect(result).toEqual(mockData);
    });

    it('should throw error if query fails', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('DB error')));

      await expect(userModel.getUserData(1)).rejects.toThrow('DB error');
    });
  });

  describe('checkAlreadyExist', () => {
    it('should resolve to true if user exists', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(null, [{}]));

      const result = await userModel.checkAlreadyExist('test@example.com');
      expect(result).toBe(true);
    });

    it('should resolve to false if user does not exist', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(null, []));

      const result = await userModel.checkAlreadyExist('noexist@example.com');
      expect(result).toBe(false);
    });

    it('should reject on DB error', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('DB error')));
      await expect(userModel.checkAlreadyExist('test@example.com')).rejects.toThrow('DB error');
    });
  });

  describe('createUserData', () => {
    it('should create user and hash password', async () => {
      bcrypt.hash.mockResolvedValue('hashed_password');
      db.query.mockImplementation((sql, data, callback) => callback(null, { insertId: 1 }));

      const result = await userModel.createUserData(
        'test@example.com', 'plain_password', 'John', 'Doe', '1234567890'
      );

      expect(result).toEqual({ insertId: 1 });
      expect(bcrypt.hash).toHaveBeenCalledWith('plain_password', 10);
    });

    it('should throw error on query failure', async () => {
      bcrypt.hash.mockResolvedValue('hashed_password');
      db.query.mockImplementation((sql, data, callback) => callback(new Error('Insert error')));

      await expect(userModel.createUserData(
        'test@example.com', 'plain_password', 'John', 'Doe', '1234567890'
      )).rejects.toThrow('Insert error');
    });
  });

  describe('loginUser', () => {
    it('should return user data if email exists', async () => {
      const user = { email: 'test@example.com', user_password: 'hashed' };
      db.query.mockImplementation((sql, params, callback) => callback(null, [user]));

      const result = await userModel.loginUser('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(null, []));

      const result = await userModel.loginUser('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  describe('deleteUserData', () => {
    it('should update is_deleted to true', async () => {
      const mockResult = { affectedRows: 1 };
      db.query.mockImplementation((sql, id, callback) => callback(null, mockResult));

      const result = await userModel.deleteUserData(5);
      expect(result).toEqual(mockResult);
    });
  });

  describe('checkDoctorAvailability', () => {
    it('should return doctor availability info', async () => {
      const mockAvailability = [{ doctorInTime: '10:00', doctorOutTime: '17:00' }];
      db.query.mockImplementation((sql, params, callback) => callback(null, mockAvailability));

      const result = await userModel.checkDoctorAvailability(1, '2025-05-01');
      expect(result).toEqual(mockAvailability);
    });
  });

  describe('updatePassword', () => {
    it('should hash and update the password', async () => {
      bcrypt.hash.mockResolvedValue('hashed_password');
      db.query.mockImplementation((sql, data, callback) => callback(null, { affectedRows: 1 }));

      const result = await userModel.updatePassword('test@example.com', 'newpass');
      expect(result).toEqual({ affectedRows: 1 });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
    });
  });

});
