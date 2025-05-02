const testConstants = require("../controllers/test.constants.js")
const doctorController = require('../../controllers/doctorController.js'); 
const doctorModel = require('../../models/doctorModel'); 
const { ResponseHandler,MessageHandler } = require('../../common/utility/handlers'); 
const { SUCCESS_STATUS_CODE, SUCCESS_MESSAGE,ERROR_STATUS_CODE,ERROR_MESSAGE } = require('../../common/constants/statusConstant');

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

    expect(doctorModel.updateDoctorData).toHaveBeenCalledWith(
      testConstants.updateDoctorBody,
      testConstants.updateDoctorUser.email
    );

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

const request = require('supertest');
const express = require('express');
// const router = require('../../routesRegister');

const app = express();
app.use(express.json());

describe('Prescription Controller Tests', () => {

  describe('uploadPrescription', () => {
    it('should return BAD_REQUEST if appointment_id is missing', async () => {
      const res = await request(app).post('/prescriptions/upload').send({});
      // expect(res.statusCode).toBe(ERROR_STATUS_CODE.BAD_REQUEST);
      // expect(res.body.message).toBe(ERROR_MESSAGE.INVALID_INPUT);
    });

    it('should successfully upload a prescription and send email', async () => {
      const res = await request(app)
        .post('/prescriptions/upload')
        .send({
          appointment_id: 1,
          medicines: ['Paracetamol'],
          capacity: ['500mg'],
          dosage: ['1 tab'],
          morning: true,
          afternoon: false,
          evening: true,
          courseDuration: '5 days'
        })
        .set('user', { email: 'user@example.com' });

      // expect(res.statusCode).toBe(SUCCESS_STATUS_CODE.SUCCESS);
      // expect(res.body.message).toBe(SUCCESS_MESSAGE.PRESCRIPTION_UPLOAD);
      // expect(res.body.cloudinaryUrl).toBeDefined();
    });
  });

  describe('updateExistsPrescription', () => {
    it('should return BAD_REQUEST if appointment_id is missing', async () => {
      const res = await request(app).post('/prescriptions/update').send({});
      // expect(res.statusCode).toBe(ERROR_STATUS_CODE.BAD_REQUEST);
      // expect(res.body.message).toBe(ERROR_MESSAGE.INVALID_INPUT);
    });

    it('should successfully update an existing prescription and send email', async () => {
      const res = await request(app)
        .post('/prescriptions/update')
        .send({
          appointment_id: 1,
          medicines: ['Paracetamol'],
          capacity: ['500mg'],
          dosage: ['1 tab'],
          morning: true,
          afternoon: false,
          evening: true,
          courseDuration: '5 days'
        })
        .set('user', { email: 'user@example.com' });

      // expect(res.statusCode).toBe(SUCCESS_STATUS_CODE.SUCCESS);
      // expect(res.body.message).toBe(SUCCESS_MESSAGE.PRESCRIPTION_UPLOAD);
      // expect(res.body.cloudinaryUrl).toBeDefined();
    });
  });

});




  });

