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
  



  describe('getUserByEmail', () => {
    it('should return user details for a valid email', async () => {
      const mockEmail = 'test@example.com';
      const mockResult = [{ id: 1, first_name: 'John', last_name: 'Doe', mobile_number: '1234567890' }];
      
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await adminModel.getUserByEmail(mockEmail);
      expect(result).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT id, first_name, last_name, mobile_number FROM user_register WHERE email = ?',
        [mockEmail],
        expect.any(Function)
      );
    });

    it('should throw an error if database query fails', async () => {
      const mockEmail = 'test@example.com';
      const mockError = new Error('Database error');
      
      db.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(getUserByEmail(mockEmail)).rejects.toThrow('Database error');
    });
  });

  describe('getUserRegisterDetails', () => {
    it('should return user details for a valid user ID', async () => {
      const mockUserId = 1;
      const mockResult = { id: 1, first_name: 'John', last_name: 'Doe', mobile_number: '1234567890', email: 'test@example.com' };
      
      db.query.mockImplementation((query, params, callback) => {
        callback(null, [mockResult]);
      });

      const result = await adminModel.getUserRegisterDetails(mockUserId);
      expect(result).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT id, first_name, last_name, mobile_number, email FROM user_register WHERE id = ?',
        [mockUserId],
        expect.any(Function)
      );
    });

    it('should throw an error if database query fails', async () => {
      const mockUserId = 1;
      const mockError = new Error('Database error');
      
      db.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(adminModel.getUserRegisterDetails(mockUserId)).rejects.toThrow('Database error');
    });
  });

  describe('createAdmin', () => {
    it('should create an admin and return result', async () => {
      const mockData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'admin@example.com',
        user_password: 'password123',
        mobile_number: '1234567890'
      };
      const mockAdminCode = 'admin123';
      const mockHashedPassword = 'hashed_password';
      const mockResult = { insertId: 1 };

      bcrypt.hash.mockResolvedValue(mockHashedPassword);
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await adminModel.createAdmin(mockData, mockAdminCode);
      expect(result).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_register'),
        [mockData.email, mockHashedPassword, mockData.first_name, mockData.last_name, mockData.mobile_number, true, mockAdminCode],
        expect.any(Function)
      );
    });

    it('should throw an error if bcrypt fails', async () => {
      const mockData = { first_name: 'John', last_name: 'Doe', email: 'admin@example.com', user_password: 'password123', mobile_number: '1234567890' };
      const mockAdminCode = 'admin123';
      const mockError = new Error('Bcrypt error');

      bcrypt.hash.mockRejectedValue(mockError);

      await expect(adminModel.createAdmin(mockData, mockAdminCode)).rejects.toThrow('Bcrypt error');
    });

    it('should throw an error if database query fails', async () => {
      const mockData = { first_name: 'John', last_name: 'Doe', email: 'admin@example.com', user_password: 'password123', mobile_number: '1234567890' };
      const mockAdminCode = 'admin123';
      const mockError = new Error('Database error');

      bcrypt.hash.mockResolvedValue('hashed_password');
      db.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(adminModel.createAdmin(mockData, mockAdminCode)).rejects.toThrow('Database error');
    });
  });

  describe('patientHaveAppointment', () => {
    it('should return appointments if patient has pending or scheduled appointments', async () => {
      const mockPatientId = 1;
      const mockResults = [{ patient_id: 1, status: 'Scheduled' }];

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      const result = await adminModel.patientHaveAppointment(mockPatientId);
      expect(result).toEqual(mockResults);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT patient_id, status FROM appointments WHERE patient_id = ? AND status IN (\'Pending\', \'Scheduled\')',
        [mockPatientId],
        expect.any(Function)
      );
    });

    it('should throw an error if database query fails', async () => {
      const mockPatientId = 1;
      const mockError = new Error('Database error');

      db.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(adminModel.patientHaveAppointment(mockPatientId)).rejects.toThrow('Database error');
    });
  });

  describe('checkPrescription', () => {
    it('should return true if prescription exists for the appointment', async () => {
      const mockAppointmentId = 1;
      const mockResult = [{ appointment_id: 1 }];

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await adminModel.checkPrescription(mockAppointmentId);
      expect(result).toBe(true);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT appointment_id FROM prescriptions WHERE appointment_id= ?',
        [mockAppointmentId],
        expect.any(Function)
      );
    });

    it('should return false if no prescription exists for the appointment', async () => {
      const mockAppointmentId = 1;
      const mockResult = [];

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await adminModel.checkPrescription(mockAppointmentId);
      expect(result).toBe(false);
    });

    it('should throw an error if database query fails', async () => {
      const mockAppointmentId = 1;
      const mockError = new Error('Database error');

      db.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(adminModel.checkPrescription(mockAppointmentId)).rejects.toThrow('Database error');
    });
  
});
})