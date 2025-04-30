import * as doctorModel from '../path-to/doctorModel';
import db from '../db/connection';

jest.mock('../db/connection');

describe('Doctor Model Functions', () => {

  describe('getDoctor', () => {
    it('should return doctor details for user ID', async () => {
      const mockResult = [{ doctorName: 'Dr. Smith', specialization: 'Cardiology' }];
      db.query.mockImplementation((sql, params, callback) => callback(null, mockResult));

      const result = await doctorModel.getDoctor(1);
      expect(result).toEqual(mockResult);
    });

    it('should throw error if DB fails', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('DB error')));

      await expect(doctorModel.getDoctor(1)).rejects.toThrow('DB error');
    });
  });

  describe('updateDoctorData', () => {
    it('should update doctor data by email', async () => {
      const mockResult = { affectedRows: 1 };
      db.query.mockImplementation((sql, values, callback) => callback(null, mockResult));

      const result = await doctorModel.updateDoctorData({ name: 'Updated Doctor' }, 'doc@example.com');
      expect(result).toEqual(mockResult);
    });

    it('should throw error on DB failure', async () => {
      db.query.mockImplementation((sql, values, callback) => callback(new Error('Update failed')));

      await expect(
        doctorModel.updateDoctorData({ name: 'Fail' }, 'fail@example.com')
      ).rejects.toThrow('Update failed');
    });
  });

  describe('showAppointments', () => {
    it('should return scheduled appointments for doctor user ID', async () => {
      const mockResult = [{ appointment_id: 1, patient_name: 'John Doe' }];
      db.query.mockImplementation((sql, params, callback) => callback(null, mockResult));

      const result = await doctorModel.showAppointments(10);
      expect(result).toEqual(mockResult);
    });

    it('should throw error on query failure', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('Query failed')));

      await expect(doctorModel.showAppointments(10)).rejects.toThrow('Query failed');
    });
  });

  describe('savePrescription', () => {
    it('should insert a new prescription', async () => {
      const mockResult = { insertId: 1 };
      db.query.mockImplementation((sql, values, callback) => callback(null, mockResult));

      const result = await doctorModel.savePrescription(1, 'http://url', '2024-01-01');
      expect(result).toEqual(mockResult);
    });

    it('should throw error on insert failure', async () => {
      db.query.mockImplementation((sql, values, callback) => callback(new Error('Insert error')));

      await expect(
        doctorModel.savePrescription(1, 'http://url', '2024-01-01')
      ).rejects.toThrow('Insert error');
    });
  });

  describe('getAppointmentData', () => {
    it('should return appointment details for given ID', async () => {
      const mockResult = [{
        patientName: 'Alice',
        date: '2024-01-01',
        doctorName: 'Dr. X'
      }];
      db.query.mockImplementation((sql, params, callback) => callback(null, mockResult));

      const result = await doctorModel.getAppointmentData(2);
      expect(result).toEqual(mockResult[0]);
    });

    it('should throw error if DB fails', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('Fail')));

      await expect(doctorModel.getAppointmentData(2)).rejects.toThrow('Fail');
    });
  });

  describe('getPrescriptionByAppointmentId', () => {
    it('should return prescription data if found', async () => {
      const mockPrescription = [{ appointment_id: 1, file_url: 'url' }];
      db.query.mockImplementation((sql, params, callback) => callback(null, mockPrescription));

      const result = await doctorModel.getPrescriptionByAppointmentId(1);
      expect(result).toEqual(mockPrescription[0]);
    });

    it('should return null if no prescription found', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(null, []));

      const result = await doctorModel.getPrescriptionByAppointmentId(1);
      expect(result).toBeNull();
    });

    it('should throw error on query fail', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('Query error')));

      await expect(doctorModel.getPrescriptionByAppointmentId(1)).rejects.toThrow('Query error');
    });
  });

  describe('updatePrescription', () => {
    it('should update prescription by appointment ID', async () => {
      const mockResult = { affectedRows: 1 };
      db.query.mockImplementation((sql, values, callback) => callback(null, mockResult));

      const result = await doctorModel.updatePrescription(1, 'newurl', '2024-01-01');
      expect(result).toEqual(mockResult);
    });

    it('should throw error on update failure', async () => {
      db.query.mockImplementation((sql, values, callback) => callback(new Error('Update error')));

      await expect(
        doctorModel.updatePrescription(1, 'failurl', '2024-01-01')
      ).rejects.toThrow('Update error');
    });
  });

});
