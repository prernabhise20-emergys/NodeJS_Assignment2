const userModel=require('../../models/userModel')
const db=require('../../db/connection')
const bcrypt=require('bcryptjs')
const testConstants = require("../models/test.model.constants")

jest.mock('../../db/connection');
jest.mock('bcryptjs');
jest.mock('../../db/connection', () => ({
  query: jest.fn(),
}));
describe('User Model Functions', () => {

  describe('getUserData', () => {
    const mockData = testConstants.getUserData;
  
    it('Success: should return user data successfully', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(null, mockData));
  
      const result = await userModel.getUserData(1);
      expect(result).toEqual(mockData);
    });
  
    it('Failure: should throw error if query fails', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('DB error')));
  
      await expect(userModel.getUserData(1)).rejects.toThrow('DB error');
    });
  });


  describe('checkAlreadyExist', () => {
    it('Success: should resolve to true if user exists', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(null, [{}]));

      const result = await userModel.checkAlreadyExist(testConstants.checkAlreadyExistReq);
      expect(result).toBe(true);
    });

    it('Failure: should resolve to false if user does not exist', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(null, []));

      const result = await userModel.checkAlreadyExist(testConstants.checkAlreadyExistReq);
      expect(result).toBe(false);
    });

    it('Failure: should reject on DB error', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('DB error')));
      await expect(userModel.checkAlreadyExist(testConstants.checkAlreadyExistReq)).rejects.toThrow('DB error');
    });
  });

  describe('createUserData', () => {
    it('Success: should create user and hash password', async () => {
      bcrypt.hash.mockResolvedValue('hashed_password');
      db.query.mockImplementation((sql, data, callback) => callback(null, { insertId: 1 }));

      const result = await userModel.createUserData(
       testConstants.createUserData
      );

      expect(result).toEqual({ insertId: 1 });
    });

    it('Failure: should throw error on query failure', async () => {
      db.query.mockImplementation((sql, data, callback) => callback(new Error('Insert error')));

      await expect(userModel.createUserData(
       testConstants.createUserData
      )).rejects.toThrow('Insert error');
    });
  });

  describe('loginUser', () => {
    it('Success: should return user data if email exists', async () => {
      const user = testConstants.loginUser;
      db.query.mockImplementation((sql, params, callback) => callback(null, [user]));

      const result = await userModel.loginUser(testConstants.loginUser.email);
      expect(result).toEqual(user);
    });

    it('Failure: should return null if user not found', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(null, []));

      const result = await userModel.loginUser(testConstants.loginUser.email);
      expect(result).toBeNull();
    });
  });

  describe('deleteUserData', () => {
    it('Success: should update is_deleted to true', async () => {
      const mockResult = { affectedRows: 1 };
      db.query.mockImplementation((sql, id, callback) => callback(null, mockResult));

      const result = await userModel.deleteUserData(5);
      expect(result).toEqual(mockResult);
    });
  });

  describe('checkDoctorAvailability', () => {
    it('Success: should return doctor availability info', async () => {
      const mockAvailability =testConstants.checkDoctorAvailability;
      db.query.mockImplementation((sql, params, callback) => callback(null, mockAvailability));

      const result = await userModel.checkDoctorAvailability(testConstants.checkDoctorAvailabilityReq);
      expect(result).toEqual(mockAvailability);
    });
  });

  describe('updatePassword', () => {
    it('Success: should hash and update the password', async () => {
      bcrypt.hash.mockResolvedValue(testConstants.loginUser.user_password);
      db.query.mockImplementation((sql, data, callback) => callback(null, { affectedRows: 1 }));

      const result = await userModel.updatePassword(testConstants.updatePassword.email,testConstants.updatePassword.newPassword);
      expect(result).toEqual({ affectedRows: 1 });
      expect(bcrypt.hash).toHaveBeenCalledWith(testConstants.updatePassword.newPassword, 10);
    });
  });

});
