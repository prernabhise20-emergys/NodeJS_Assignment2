const testConstants = require("../controllers/test.constants.js")
const doctorController = require('../../controllers/doctorController.js').default; 
const doctorModel = require('../../models/doctorModel'); 
const { ResponseHandler,MessageHandler } = require('../../common/utility/handlers'); 
const { SUCCESS_STATUS_CODE, SUCCESS_MESSAGE,ERROR_STATUS_CODE,ERROR_MESSAGE } = require('../../common/constants/statusConstant');
const sendUpdatePrescriptionEmail=require('../../common/utility/sendUpdatePrescriptionEmail.js')
const sendCancelledAppointmentEmail=require('../../common/utility/cancelledAppointment')
jest.mock('../../models/doctorModel');  
jest.mock("../../common/utility/handlers", () => ({
  ResponseHandler: jest.fn(),
  MessageHandler: jest.fn(),
}))

describe('Doctor controller test cases', () => {
  describe('getDoctorProfile', () => {
    it('Success: should return doctor profile when valid user ID is provided', async () => {
      const req = {
        user: testConstants.getDoctorProfile,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      const mockDoctorData = testConstants.getDoctorProfileResult;

      doctorModel.getDoctor.mockResolvedValue(mockDoctorData);

      await doctorController.getDoctorProfile(req, res, next);

      expect(doctorModel.getDoctor).toHaveBeenCalledWith(testConstants.getDoctorProfile.userid);

      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);

      expect(res.send).toHaveBeenCalledWith(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DOCTOR_PROFILE, mockDoctorData)
      );
    });

    it('Failure: should call next with an error if the doctor profile is not found', async () => {
      const req = {
        user: testConstants.getDoctorProfile,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();

      doctorModel.getDoctor.mockResolvedValue(null);

      await doctorController.getDoctorProfile(req, res, next);

    });

    it('Failure: should call next with an error if an unexpected error occurs', async () => {
      const req = {
        user: {
          userid: testConstants.getDoctorProfile.userid,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const next = jest.fn();


      await doctorController.getDoctorProfile(req, res, next);

      expect(next).not.toHaveBeenCalledWith(new Error('error'))
       });
  });
  

describe('updateDoctor', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: testConstants.updateDoctorBody,
      user: testConstants.updateDoctorUser,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  it('Success: should update doctor data and return success response if the user is a doctor', async () => {
   doctorModel. updateDoctorData.mockResolvedValue();

    await doctorController.updateDoctor(req, res, next);

    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.UPDATED_DOCTOR_INFO_MESSAGE
      )
    );
  });

  it('Failure: should return forbidden response if the user is not a doctor', async () => {
    req.user.doctor = false;

    await doctorController.updateDoctor(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.FORBIDDEN);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        ERROR_STATUS_CODE.FORBIDDEN,
        ERROR_MESSAGE.ADMIN_ACCESS
      )
    );
  });

  it('Failure: should call next with error if an exception occurs', async () => {
    const error = new Error('Something went wrong');
    doctorModel.updateDoctorData.mockRejectedValue(error);

    await doctorController.updateDoctor(req, res, next);

    expect(next).not.toHaveBeenCalledWith(new Error('error'))
  });
});


describe('displayAppointments', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: testConstants.displayAppointmentsBody,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('Success: should return appointments for a doctor or admin user', async () => {
    req.user.doctor = true; 
    const mockAppointments = testConstants.displayAppointmentsResult;
    doctorModel.showAppointments.mockResolvedValue(mockAppointments);

    await doctorController.displayAppointments(req, res, next);

    expect(doctorModel.showAppointments).toHaveBeenCalledWith(req.user.userid);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      expect.any(ResponseHandler)
    );
  });

  it('Failure: should return an unauthorized access message for non-doctor/non-admin users', async () => {
    req.user.doctor = false;
    req.user.admin = false;

    await doctorController.displayAppointments(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.INVALID);
    expect(res.send).toHaveBeenCalledWith(
      expect.any(ResponseHandler)
    );
  });

  it('Failure: should call next with error in case of an exception', async () => {
    req.user.doctor = true;
    const mockError = new Error('Test Error');
    doctorModel.showAppointments.mockRejectedValue(mockError);

    await doctorController.displayAppointments(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});

const  uploadFile = require('../../common/utility/upload.js');
const  generatePdf = require('../../common/utility/prescriptionPdf.js');
const  sendPrescription = require('../../common/utility/sendPrescription.js');


describe('uploadPrescription Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        appointment_id: '1',
        medicines: 'Paracetamol',
        capacity: '500mg',
        morning: 'Yes',
        afternoon: 'No',
        evening: 'Yes',
        courseDuration: '5 days',
        notes: 'Take with food',
        dosage: 'Twice a day'
      },
      user: { email: 'test@example.com' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 400 if required fields are missing', async () => {
    req.body.medicines = '';
    await doctorController.uploadPrescription(req, res, next);
    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should return 500 if file upload fails', async () => {
    doctorModel.getAppointmentData.mockResolvedValue({
      patient_id: 101,
      patientName: 'John Doe',
      date: '2024-01-01',
      age: 30,
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      gender: 'Male',
      date_of_birth: '1993-01-01'
    });

    generatePdf.mockResolvedValue(Buffer.from('PDF'));
    uploadFile.mockResolvedValue(null);

    await doctorController.uploadPrescription(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.INTERNAL_ERROR);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should successfully upload prescription and send email', async () => {
    doctorModel.getAppointmentData.mockResolvedValue({
      patient_id: 101,
      patientName: 'John Doe',
      date: '2024-01-01',
      age: 30,
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      gender: 'Male',
      date_of_birth: '1993-01-01'
    });

    generatePdf.mockResolvedValue(Buffer.from('PDF'));

    uploadFile.mockResolvedValue({
      secure_url: 'https://cloudinary.com/raw/upload/prescription/101.pdf'
    });

    doctorModel.savePrescription.mockResolvedValue(true);
    sendPrescription.mockResolvedValue(true);

    await doctorController.uploadPrescription(req, res, next);

    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
    expect(sendPrescription).toHaveBeenCalledWith('test@example.com', expect.stringContaining('https://cloudinary.com'));
  });

  it('should call next with error on exception', async () => {
    doctorModel.getAppointmentData.mockRejectedValue(new Error('DB error'));

    await doctorController.uploadPrescription(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});


describe('updateExistsPrescription', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        appointment_id: '123',
        medicines: 'Paracetamol',
        capacity: '500mg',
        morning: 'Yes',
        afternoon: 'No',
        evening: 'Yes',
        courseDuration: '5 days',
        notes: 'After meals',
        dosage: '2 times a day'
      },
      user: { email: 'doctor@example.com' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    next = jest.fn();
  });

  it('should return 400 if required fields are missing', async () => {
    req.body.medicines = '';
    await doctorController.updateExistsPrescription(req, res, next);
    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should return 500 if file upload fails', async () => {
    doctorModel.getAppointmentData.mockResolvedValue({
      patient_id: 1,
      patientName: 'John',
      date: '2024-01-01',
      age: 30,
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      gender: 'Male',
      date_of_birth: '1993-01-01'
    });

    generatePdf.mockResolvedValue(Buffer.from('pdf'));
    uploadFile.mockResolvedValue(null); 

    await doctorController.updateExistsPrescription(req, res, next);
    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.INTERNAL_ERROR);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should call updatePrescription if record exists', async () => {
    doctorModel.getAppointmentData.mockResolvedValue({
      patient_id: 1,
      patientName: 'John',
      date: '2024-01-01',
      age: 30,
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      gender: 'Male',
      date_of_birth: '1993-01-01'
    });

    generatePdf.mockResolvedValue(Buffer.from('pdf'));
    uploadFile.mockResolvedValue({
      secure_url: 'https://cloudinary.com/raw/upload/prescriptions/file.pdf'
    });

    doctorModel.getPrescriptionByAppointmentId.mockResolvedValue({ id: 1 }); 
    doctorModel.updatePrescription.mockResolvedValue(true);
    sendUpdatePrescriptionEmail.mockResolvedValue(true);

    await doctorController.updateExistsPrescription(req, res, next);

    expect(doctorModel.updatePrescription).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should call savePrescription if no existing prescription', async () => {
    doctorModel.getAppointmentData.mockResolvedValue({
      patient_id: 1,
      patientName: 'John',
      date: '2024-01-01',
      age: 30,
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      gender: 'Male',
      date_of_birth: '1993-01-01'
    });

    generatePdf.mockResolvedValue(Buffer.from('pdf'));
    uploadFile.mockResolvedValue({
      secure_url: 'https://cloudinary.com/raw/upload/prescriptions/file.pdf'
    });

    doctorModel.getPrescriptionByAppointmentId.mockResolvedValue(null); 
    doctorModel.savePrescription.mockResolvedValue(true);
    sendUpdatePrescriptionEmail.mockResolvedValue(true);

    await doctorController.updateExistsPrescription(req, res, next);

    expect(doctorModel.savePrescription).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should call next with error on exception', async () => {
    doctorModel.getAppointmentData.mockRejectedValue(new Error('DB error'));
    await doctorController.updateExistsPrescription(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('changeDoctorAvailabilityStatus', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        is_available: false,
        unavailable_from_date: '2025-05-15',
        unavailable_to_date: '2025-05-20'
      },
      user: {
        doctor: true,
        userid: 42
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    next = jest.fn();
  });

  it('should return 403 if user is not a doctor', async () => {
    req.user.doctor = false;

    await doctorController.changeDoctorAvailabilityStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.FORBIDDEN);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should send cancellation emails if appointments exist', async () => {
    doctorModel.changeAvailabilityStatus.mockResolvedValue();
    doctorModel.markCancelled.mockResolvedValue([
      {
        email: 'patient@example.com',
        patient_name: 'John Doe',
        appointment_date: '2025-05-16',
        appointment_time: '10:00 AM',
        name: 'Dr. Smith'
      }
    ]);
    sendCancelledAppointmentEmail.mockResolvedValue();

    await doctorController.changeDoctorAvailabilityStatus(req, res, next);

    expect(doctorModel.changeAvailabilityStatus).toHaveBeenCalledWith(
      false,
      42,
      '2025-05-15',
      '2025-05-20'
    );
    expect(sendCancelledAppointmentEmail).toHaveBeenCalledWith(
      'patient@example.com',
      'Doctor unavailability',
      'John Doe',
      '2025-05-16',
      '10:00 AM',
      'Dr. Smith'
    );
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should return 400 if no appointments to cancel', async () => {
    doctorModel.changeAvailabilityStatus.mockResolvedValue();
    doctorModel.markCancelled.mockResolvedValue([]);

    await doctorController.changeDoctorAvailabilityStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should call next with error on exception', async () => {
    doctorModel.changeAvailabilityStatus.mockRejectedValue(new Error('Database error'));

    await doctorController.changeDoctorAvailabilityStatus(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('Observation ', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {
        appointment_id: '12345'
      },
      body: {
        observation: 'Patient is doing well'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  describe('addObservation', () => {
    it('should return 400 if appointment_id or observation is missing', async () => {
      req.body.observation = null;

      await doctorController.addObservation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
    });

    it('should return 200 and add observation successfully', async () => {
      doctorModel.addObservationData.mockResolvedValue();

      await doctorController.addObservation(req, res, next);

      expect(doctorModel.addObservationData).toHaveBeenCalledWith('Patient is doing well', '12345');
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
      expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
    });

    it('should call next with error on failure', async () => {
      doctorModel.addObservationData.mockRejectedValue(new Error('Database error'));

      await doctorController.addObservation(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('editObservation', () => {
    it('should edit observation successfully', async () => {
      doctorModel.editObservationData.mockResolvedValue();

      await doctorController.editObservation(req, res, next);

      expect(doctorModel.editObservationData).toHaveBeenCalledWith('Patient is doing well', '12345');
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
      expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
    });

    it('should call next with error on failure', async () => {
      doctorModel.editObservationData.mockRejectedValue(new Error('Database error'));

      await doctorController.editObservation(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteObservation', () => {
    it('should delete observation successfully', async () => {
      doctorModel.deleteObservationData.mockResolvedValue();

      await doctorController.deleteObservation(req, res, next);

      expect(doctorModel.deleteObservationData).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
      expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
    });

    it('should call next with error on failure', async () => {
      doctorModel.deleteObservationData.mockRejectedValue(new Error('Database error'));

      await doctorController.deleteObservation(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getObservation', () => {
    it('should return 200 and get observation successfully', async () => {
      const mockObservation = { observation: 'Patient is improving' };
      doctorModel.getObservationData.mockResolvedValue(mockObservation);

      await doctorController.getObservation(req, res, next);

      expect(doctorModel.getObservationData).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
      expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
    });

    it('should call next with error on failure', async () => {
      doctorModel.getObservationData.mockRejectedValue(new Error('Database error'));

      await doctorController.getObservation(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});

  });

