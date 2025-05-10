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

   describe('changeAvailabilityStatus', () => {
    it('should set doctor as available and remove unavailable dates', async () => {
      const mockIsAvailable = true;
      const mockUserId = 1;
      const mockQuery = 'UPDATE doctors SET is_available = ?, unavailable_from_date = NULL, unavailable_to_date = NULL WHERE user_id = ? and is_deleted=false';
      const mockParams = [mockIsAvailable, mockUserId];
      const mockResult = { affectedRows: 1 };

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await doctorModel.changeAvailabilityStatus(mockIsAvailable, mockUserId);
      expect(result).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(mockQuery, mockParams, expect.any(Function));
    });

    it('should set doctor as unavailable and update unavailable dates', async () => {
      const mockIsAvailable = false;
      const mockUserId = 1;
      const mockUnavailableFromDate = '2025-05-10';
      const mockUnavailableToDate = '2025-05-20';
      const mockQuery = 'UPDATE doctors SET is_available = ?, unavailable_from_date = ?, unavailable_to_date = ? WHERE user_id = ? and is_deleted=false';
      const mockParams = [mockIsAvailable, mockUnavailableFromDate, mockUnavailableToDate, mockUserId];
      const mockResult = { affectedRows: 1 };

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await doctorModel.changeAvailabilityStatus(mockIsAvailable, mockUserId, mockUnavailableFromDate, mockUnavailableToDate);
      expect(result).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(mockQuery, mockParams, expect.any(Function));
    });

    it('should throw an error if database query fails', async () => {
      const mockIsAvailable = false;
      const mockUserId = 1;
      const mockError = new Error('Database error');
      
      db.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(doctorModel.changeAvailabilityStatus(mockIsAvailable, mockUserId)).rejects.toThrow('Database error');
    });
  });

  describe('markCancelled', () => {
    it('should mark appointments as cancelled within the given date range', async () => {
      const mockUnavailableFromDate = '2025-05-10';
      const mockUnavailableToDate = '2025-05-20';
      const mockAppointmentIds = [1, 2];
      const mockQuerySelect = 'SELECT appointment_id FROM appointments WHERE appointment_date BETWEEN ? AND ?';
      const mockQueryUpdate = 'UPDATE appointments SET status="Cancelled" WHERE appointment_date BETWEEN ? AND ?';
      const mockResultSelect = [{ appointment_id: 1 }, { appointment_id: 2 }];
      const mockResultUpdate = { affectedRows: 2 };

      db.query.mockImplementationOnce((query, params, callback) => {
        callback(null, mockResultSelect);
      });

      db.query.mockImplementationOnce((query, params, callback) => {
        callback(null, mockResultUpdate);
      });

      const result = await doctorModel.markCancelled(mockUnavailableFromDate, mockUnavailableToDate);
      expect(result).toEqual(mockResultSelect);
      expect(db.query).toHaveBeenCalledWith(mockQuerySelect, [mockUnavailableFromDate, mockUnavailableToDate], expect.any(Function));
      expect(db.query).toHaveBeenCalledWith(mockQueryUpdate, [mockUnavailableFromDate, mockUnavailableToDate], expect.any(Function));
    });

    it('should throw an error if database query fails', async () => {
      const mockUnavailableFromDate = '2025-05-10';
      const mockUnavailableToDate = '2025-05-20';
      const mockError = new Error('Database error');

      db.query.mockImplementationOnce((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(doctorModel.markCancelled(mockUnavailableFromDate, mockUnavailableToDate)).rejects.toThrow('Database error');
    });
  });

  describe('getUserInformation', () => {
    it('should return user information for given appointment ids', async () => {
      const mockAppointmentIds = [1, 2];
      const mockQuery = `SELECT a.appointment_id, p.patient_name, u.email, a.appointment_date, a.appointment_time, d.name, d.email AS doctor_email
                         FROM user_register u 
                         JOIN personal_info p ON u.id = p.user_id
                         JOIN appointments a ON p.patient_id = a.patient_id
                         JOIN doctors d ON a.doctor_id = d.doctor_id
                         WHERE a.appointment_id IN (?) and p.is_deleted=false`;
      const mockResult = [
        { appointment_id: 1, patient_name: 'Jane Doe', email: 'patient1@example.com', appointment_date: '2025-05-10', appointment_time: '10:00', name: 'Dr. Smith', doctor_email: 'doctor1@example.com' },
        { appointment_id: 2, patient_name: 'John Doe', email: 'patient2@example.com', appointment_date: '2025-05-12', appointment_time: '11:00', name: 'Dr. Smith', doctor_email: 'doctor1@example.com' }
      ];

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await doctorModel.getUserInformation(mockAppointmentIds);
      expect(result).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(mockQuery, [mockAppointmentIds], expect.any(Function));
    });

    it('should throw an error if database query fails', async () => {
      const mockAppointmentIds = [1, 2];
      const mockError = new Error('Database error');

      db.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(doctorModel.getUserInformation(mockAppointmentIds)).rejects.toThrow('Database error');
    });
  });

  describe('addObservationData', () => {
    it('should add observation data for an appointment', async () => {
      const mockObservation = 'Observation text';
      const mockAppointmentId = 1;
      const mockQuery = 'UPDATE appointments SET observation=? WHERE appointment_id=?';
      const mockParams = [mockObservation, mockAppointmentId];
      const mockResult = { affectedRows: 1 };

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await doctorModel.addObservationData(mockObservation, mockAppointmentId);
      expect(result).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(mockQuery, mockParams, expect.any(Function));
    });

    it('should throw an error if database query fails', async () => {
      const mockObservation = 'Observation text';
      const mockAppointmentId = 1;
      const mockError = new Error('Database error');

      db.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(doctorModel.addObservationData(mockObservation, mockAppointmentId)).rejects.toThrow('Database error');
    });
  });

  describe('editObservationData', () => {
    it('should edit observation data for an appointment', async () => {
      const mockObservation = 'Edited observation text';
      const mockAppointmentId = 1;
      const mockQuery = 'UPDATE appointments SET observation=? WHERE appointment_id=?';
      const mockParams = [mockObservation, mockAppointmentId];
      const mockResult = { affectedRows: 1 };

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await doctorModel.editObservationData(mockObservation, mockAppointmentId);
      expect(result).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(mockQuery, mockParams, expect.any(Function));
    });

    it('should throw an error if database query fails', async () => {
      const mockObservation = 'Edited observation text';
      const mockAppointmentId = 1;
      const mockError = new Error('Database error');

      db.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(doctorModel.editObservationData(mockObservation, mockAppointmentId)).rejects.toThrow('Database error');
    });
  });

  describe('deleteObservationData', () => {
    it('should delete observation data for an appointment', async () => {
      const mockAppointmentId = 1;
      const mockQuery = 'UPDATE appointments SET observation=null WHERE appointment_id=?';
      const mockParams = [mockAppointmentId];
      const mockResult = { affectedRows: 1 };

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await doctorModel.deleteObservationData(mockAppointmentId);
      expect(result).toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(mockQuery, mockParams, expect.any(Function));
    });
  })

  describe('getObservationData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return observation data for a valid appointment ID', async () => {
    const mockAppointmentId = 1;
    const mockResult = [{ appointment_id: 1, observation: 'Patient is stable' }];

    db.query.mockImplementation((query, params, callback) => {
      expect(query).toBe('select appointment_id,observation from appointments where appointment_id=?');
      expect(params).toBe(mockAppointmentId); 
      callback(null, mockResult);
    });

    const result = await doctorModel.getObservationData(mockAppointmentId);
    expect(result).toEqual(mockResult);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the database query fails', async () => {
    const mockAppointmentId = 1;
    const mockError = new Error('Database error');

    db.query.mockImplementation((query, params, callback) => {
      callback(mockError, null);
    });

    await expect(doctorModel.getObservationData(mockAppointmentId)).rejects.toThrow('Database error');
  });
});
});
