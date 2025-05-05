const adminModel=require('../../models/adminModel')
const db=require('../../db/connection')
const bcrypt=require('bcryptjs')
const testConstants = require("../models/test.model.constants")

jest.mock('../../db/connection');
jest.mock('bcryptjs');
jest.mock('../../db/connection', () => ({
  query: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('Admin Model Test Cases',()=>{

describe('getInfo', () => {
  
  
    it('should return formatted patient data when admin', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null, testConstants.getInfo);
      });
  
      const result = await adminModel.getInfo(true, 10, 0);
    });
  });

  describe('getTotalCount', () => {
 
  
    it('Success: should return total count if admin', async () => {
      db.query.mockImplementation((sql, callback) => {
        callback(null, [{ total: 5 }]);
      });
  
      const result = await adminModel.getTotalCount(true);
      expect(result).toBe(5);
    });
  });

  describe('deletePatientDetails', () => {
    it('Failure: should throw error if patient does not exist', async () => {
      db.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ count: 0 }]);
      });
  
      await expect(adminModel.deletePatientDetails(1)).rejects.toThrow('Patient ID does not exist or is already deleted.');
    });
  
    it('Success: should update is_deleted flags if patient exists', async () => {
      db.query
        .mockImplementationOnce((sql, params, callback) => callback(null, [{ count: 1 }])) 
        .mockImplementationOnce((sql, params, callback) => callback(null, { affectedRows: 1 })); 
  
      const result = await adminModel.deletePatientDetails(1);
      expect(result).toEqual({ affectedRows: 1 });
    });
  });

describe('createDoctorData', () => {
  it('should insert user and doctor data', async () => {
    const testData =testConstants.createDoctorData;

    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { insertId: 42 }); 
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

    const result = await adminModel.createDoctorData(testData);
    expect(result).toEqual({ affectedRows: 1 });
  });
});

describe('changeStatus', () => {
    it('should update appointment status', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 1 });
      });
  
      const result = await adminModel.changeStatus('Scheduled', 1);
      expect(result).toEqual({ affectedRows: 1 });
    });
  });
  

  
})