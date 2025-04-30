const doctorModel=require('../../models/doctorModel')
const db=require('../../db/connection')
const bcrypt=require('bcryptjs')
const testConstants = require("../models/test.model.constants")

jest.mock('../../db/connection');
jest.mock('bcryptjs');
jest.mock('../../db/connection', () => ({
  query: jest.fn(),
}));

describe('Doctor Model Functions', () => {

  describe('getDoctor', () => {
    it('Success: should return doctor details for user ID', async () => {
      const mockResult = testConstants.getDoctorResult;
      db.query.mockImplementation((sql, params, callback) => callback(null, mockResult));

      const result = await doctorModel.getDoctor(1);
      expect(result).toEqual(mockResult);
    });

    it('Failure: should throw error if DB fails', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('DB error')));

      await expect(doctorModel.getDoctor(1)).rejects.toThrow('DB error');
    });
  });

  describe('updateDoctorData', () => {
    it('Success: should update doctor data by email', async () => {
      const mockResult = { affectedRows: 1 };
      db.query.mockImplementation((sql, values, callback) => callback(null, mockResult));

      const result = await doctorModel.updateDoctorData( testConstants.updateDoctor.name , testConstants.updateDoctor.email);
      expect(result).toEqual(mockResult);
    });

    it('Failure: should throw error on DB failure', async () => {
      db.query.mockImplementation((sql, values, callback) => callback(new Error('Update failed')));

      await expect(
        doctorModel.updateDoctorData(testConstants.updateDoctor.name , testConstants.updateDoctor.email)
      ).rejects.toThrow('Update failed');
    });
  });

  describe('showAppointments', () => {
    it('Success: should return scheduled appointments for doctor user ID', async () => {
      const mockResult = testConstants.showAppointments;
      db.query.mockImplementation((sql, params, callback) => callback(null, mockResult));

      const result = await doctorModel.showAppointments(10);
      expect(result).toEqual(mockResult);
    });

    it('Failure: should throw error on query failure', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('Query failed')));

      await expect(doctorModel.showAppointments(10)).rejects.toThrow('Query failed');
    });
  });

  describe('savePrescription', () => {
    it('Success: should insert a new prescription', async () => {
      const mockResult = { insertId: 1 };
      db.query.mockImplementation((sql, values, callback) => callback(null, mockResult));

      const result = await doctorModel.savePrescription(testConstants.savePrescription);
      expect(result).toEqual(mockResult);
    });

    it('Error: should throw error on insert failure', async () => {
      db.query.mockImplementation((sql, values, callback) => callback(new Error('Insert error')));

      await expect(
        doctorModel.savePrescription(testConstants.savePrescription)
      ).rejects.toThrow('Insert error');
    });
  });

  describe('getAppointmentData', () => {
    it('Success: should return appointment details for given ID', async () => {
      const mockResult = testConstants.getAppointmentData;
      db.query.mockImplementation((sql, params, callback) => callback(null, mockResult));

      const result = await doctorModel.getAppointmentData(2);
      expect(result).toEqual(mockResult[0]);
    });

    it('Failure: should throw error if DB fails', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('Fail')));

      await expect(doctorModel.getAppointmentData(2)).rejects.toThrow('Fail');
    });
  });

  describe('getPrescriptionByAppointmentId', () => {
    it('Success: should return prescription data if found', async () => {
      const mockPrescription =testConstants.getPrescription;
      db.query.mockImplementation((sql, params, callback) => callback(null, mockPrescription));

      const result = await doctorModel.getPrescriptionByAppointmentId(1);
      expect(result).toEqual(mockPrescription[0]);
    });

    it('Failure: should return null if no prescription found', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(null, []));

      const result = await doctorModel.getPrescriptionByAppointmentId(1);
      expect(result).toBeNull();
    });

    it('Failure: should throw error on query fail', async () => {
      db.query.mockImplementation((sql, params, callback) => callback(new Error('Query error')));

      await expect(doctorModel.getPrescriptionByAppointmentId(1)).rejects.toThrow('Query error');
    });
  });

  describe('updatePrescription', () => {
    it('should update prescription by appointment ID', async () => {
      const mockResult = { affectedRows: 1 };
      db.query.mockImplementation((sql, values, callback) => callback(null, mockResult));

      const result = await doctorModel.updatePrescription(testConstants.savePrescription);
      expect(result).toEqual(mockResult);
    });

    it('should throw error on update failure', async () => {
      db.query.mockImplementation((sql, values, callback) => callback(new Error('Update error')));

      await expect(
        doctorModel.updatePrescription(testConstants.savePrescription)
      ).rejects.toThrow('Update error');
    });
  });

});
