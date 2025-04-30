import db from '../db/connection.js';
import * as controller from '../controllers/adminController'; // adjust path accordingly
import { AUTH_RESPONSES } from '../common/constants/response.js';

jest.mock('../db/connection.js', () => ({
  query: jest.fn(),
}));

describe('getInfo', () => {
    it('should throw unauthorized error if not admin', async () => {
      await expect(controller.getInfo(false, 10, 0)).rejects.toEqual(AUTH_RESPONSES.UNAUTHORIZED_ACCESS);
    });
  
    it('should return formatted patient data when admin', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null, [
          {
            patient_id: 1,
            patient_name: 'John',
            gender: 'Male',
            document_type: 'PDF',
            document_url: 'http://example.com/doc.pdf',
          }
        ]);
      });
  
      const result = await controller.getInfo(true, 10, 0);
      expect(result).toEqual([
        {
          patient_id: 1,
          patient_name: 'John',
          gender: 'Male',
          documents: [
            { document_type: 'PDF', document_url: 'http://example.com/doc.pdf' }
          ],
        }
      ]);
    });
  });

  describe('getTotalCount', () => {
    it('should throw unauthorized error if not admin', async () => {
      await expect(controller.getTotalCount(false)).rejects.toEqual(AUTH_RESPONSES.UNAUTHORIZED_ACCESS);
    });
  
    it('should return total count if admin', async () => {
      db.query.mockImplementation((sql, callback) => {
        callback(null, [{ total: 5 }]);
      });
  
      const result = await controller.getTotalCount(true);
      expect(result).toBe(5);
    });
  });

  describe('deletePatientDetails', () => {
    it('should throw error if patient does not exist', async () => {
      db.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, [{ count: 0 }]);
      });
  
      await expect(controller.deletePatientDetails(1)).rejects.toThrow('Patient ID does not exist or is already deleted.');
    });
  
    it('should update is_deleted flags if patient exists', async () => {
      db.query
        .mockImplementationOnce((sql, params, callback) => callback(null, [{ count: 1 }])) // Exists check
        .mockImplementationOnce((sql, params, callback) => callback(null, { affectedRows: 1 })); // Update
  
      const result = await controller.deletePatientDetails(1);
      expect(result).toEqual({ affectedRows: 1 });
    });
  });

  import bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('createDoctorData', () => {
  it('should insert user and doctor data', async () => {
    const testData = {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
      user_password: 'password',
      contact_number: '1234567890',
      doctorCode: 'DOC001',
      name: 'Dr. Jane',
      specialization: 'Cardiology',
      doctorInTime: '10:00',
      doctorOutTime: '18:00'
    };

    // Mock user insert
    db.query
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { insertId: 42 }); // mocked user_id
      })
      .mockImplementationOnce((sql, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

    const result = await controller.createDoctorData(testData);
    expect(result).toEqual({ affectedRows: 1 });
  });
});

describe('changeStatus', () => {
    it('should update appointment status', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null, { affectedRows: 1 });
      });
  
      const result = await controller.changeStatus('Scheduled', 1);
      expect(result).toEqual({ affectedRows: 1 });
    });
  });
  