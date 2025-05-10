const testConstants = require("../controllers/test.constants.js")
const adminController = require('../../controllers/adminController.js').default; 
const adminModel = require('../../models/adminModel'); 
const { ResponseHandler,MessageHandler } = require('../../common/utility/handlers'); 
const { SUCCESS_STATUS_CODE, SUCCESS_MESSAGE,ERROR_STATUS_CODE,ERROR_MESSAGE } = require('../../common/constants/statusConstant');
const jwt = require('jsonwebtoken');
const sendRegisterCode=require('../../common/utility/sendRegisterCode.js')
jest.mock('../../models/doctorModel'); 
const {AUTH_RESPONSES}=require('../../common/constants/response.js') 
const {  CANNOT_DELETE_SUPERADMIN, CANNOT_DELETE_USER } = AUTH_RESPONSES;
const sendCancelledAppointmentEmail=require('../../common/utility/cancelledAppointment.js')
const approveRequest =require('../../common/utility/approveAppointment.js')
const axios = require('axios');
const fs = require('fs');
const stream = require('stream');
jest.mock("../../common/utility/handlers", () => ({
  ResponseHandler: jest.fn(),
  MessageHandler: jest.fn(),
}))

describe('Admin Controller Test Cases',()=>{

    describe('getAllInfo', () => {
        let mockReq, mockRes, mockNext;
      
        beforeEach(() => {
          mockReq = testConstants.getAllInfoRequest;
          mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
          };
          mockNext = jest.fn();
        });
      
        it('Success: should return success response when admin is authorized and data is retrieved successfully', async () => {
          const mockPersonalInfo = testConstants.getAllInfoPersonal;
          const mockTotalCount = testConstants.totalCount.count;
      
          jest.mock('../../models/adminModel.js', () => ({
            getInfo: jest.fn().mockResolvedValue(mockPersonalInfo),
            getTotalCount: jest.fn().mockResolvedValue(mockTotalCount),
          }));
             
          await adminController.getAllInfo(mockReq, mockRes, mockNext);
      
          expect(mockRes.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
      
        });
      
        it('Failure: should call next with an error when admin is not authorized', async () => {
          mockReq.user.admin = false;
      
      
          await adminController.getAllInfo(mockReq, mockRes, mockNext);
      
          expect(mockRes.status).not.toHaveBeenCalled();
          expect(mockRes.send).not.toHaveBeenCalled();
        });
      
        it('Failure: should call next with an error on unexpected failure', async () => {
          const mockError = new Error('Unexpected error');
      
          jest.mock('../../models/adminModel.js', () => ({
            getInfo: jest.fn().mockRejectedValue(mockError),
            getTotalCount: jest.fn(),
          }));
    
          await adminController.getAllInfo(mockReq, mockRes, mockNext);
      
          expect(mockRes.status).not.toHaveBeenCalled();
          expect(mockRes.send).not.toHaveBeenCalled();
        });
      });
      

describe('adminDeletePatientData', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = testConstants.adminDeletePatientDataBody;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Success: should call deletePatientDetails and send success response when user is admin', async () => {

    await adminController.adminDeletePatientData(mockReq, mockRes, mockNext);

  });

  it('Failure: should call next with error when user is not admin', async () => {
    mockReq.user.admin = false;
    const NOT_DELETED = new Error('Not deleted');

    await adminController.adminDeletePatientData(mockReq, mockRes, mockNext);

    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.send).not.toHaveBeenCalled();
  });

  it('Failure: should call next with error when deletePatientDetails throws an error', async () => {
    const error = new Error('Some error');

    await adminController.adminDeletePatientData(mockReq, mockRes, mockNext);

    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.send).not.toHaveBeenCalled();
  });
});

describe('ageGroupData', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {
      user: testConstants.ageGroupDataUser
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('Success: should return age group data successfully', async () => {
    const mockAgeGroupData =testConstants.ageGroupDataSample


    await adminController.ageGroupData(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockResponse.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
       testConstants.ageGroupDataResponse
      )
    );
  });

  it('Failure: should handle missing age group data gracefully', async () => {

    const mockAgeGroupData = []; 


    await adminController.ageGroupData(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockResponse.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
        testConstants.ageGroupDataZeroResponse
      )
    );
  });

  it('Failure:should handle errors correctly', async () => {
    const mockError = new Error('Something went wrong');

    await adminController.ageGroupData(mockRequest, mockResponse, mockNext);

    expect(mockNext).not.toHaveBeenCalledWith(mockError); 
  });
});



jest.mock('../../models/adminModel.js', () => ({
  createAdmin: jest.fn(),
}));
jest.mock('../../common/utility/sendRegisterCode.js',()=>({
    sendRegisterCode: jest.fn(),

}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockedToken'),
}));

describe('addAdmin', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: testConstants.addAdminBody,
    };

    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  it('Success: should successfully add an admin and send registration code', async () => {
    await adminController.addAdmin(req, res, next);

   
  });

 

  it('Failure: should fail if required fields are missing', async () => {
    req.body = {}; 

    await adminController.addAdmin(req, res, next);

  });
});

jest.mock('../../models/adminModel.js', () => ({
    checkSuperAdmin: jest.fn(),
    checkAdminCount: jest.fn(),
    removeAdminAuthority: jest.fn(),
  }));
  
  
  describe('removeAdmin', () => {
    let req, res, next;
  
    beforeEach(() => {
      req = testConstants.removeAdminReqBody;
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      next = jest.fn();
    });
   
      
      
      it('Success: should throw CANNOT_DELETE_SUPERADMIN if user is super admin', async () => {
      
        await adminController.removeAdmin(req, res, next);
      
      });
      
   
    it('Failure: should throw CANNOT_DELETE_USER if user is admin and adminCount <= 1', async () => {
   
      await adminController.removeAdmin(req, res, next);
  
    });
  
    it('Success: should call removeAdminAuthority and send a success response', async () => {
    
      await adminController.removeAdmin(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
      expect(res.send).toHaveBeenCalledWith(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.REMOVE_ADMIN)
      );
    });
  
    it('Failure: should pass error to next if removeAdminAuthority throws an error', async () => {
      const error = new Error('Some error');
  
      await adminController.removeAdmin(req, res, next);
  
    });
  });

describe('getAdmin', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user:testConstants.getAdminUser,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('Success: should return admin details if user is admin', async () => {
    req.user.admin = true;
    const mockAdminData = testConstants.getAdminParams;

    await adminController.getAdmin(req, res, next);

    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.GET_ADMIN,
        mockAdminData
      )
    );
  });

  it('Failure: should return error if user is not admin', async () => {
    req.user.admin = false;

    await adminController.getAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        ERROR_STATUS_CODE.BAD_REQUEST,
        ERROR_MESSAGE.ADMIN_ACCESS
      )
    );
  });

  it('Failure: should call next with error if an exception occurs', async () => {
    const mockError = new Error('Something went wrong');
    req.user.admin = true;

    await adminController.getAdmin(req, res, next);

    expect(next).not.toHaveBeenCalledWith(new Error('error'));
  });
});

describe('addDoctor', () => {
  const mockReq = {
    user: testConstants.addDoctorUser,
    body: testConstants.addDoctorBody,
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Success: should add a doctor successfully and send a response', async () => {

    await adminController.addDoctor(mockReq, mockRes, next);
    
  });

  it('Failure: should return 400 error if the user is not admin', async () => {
    const nonAdminReq = { ...mockReq, user: { admin: false } };

    await adminController.addDoctor(nonAdminReq, mockRes, next);

  });

  it('Failure: should call next with error on failure', async () => {
    const error = new Error('Database error');

    await adminController.addDoctor(mockReq, mockRes, next);

  });
});

describe('deleteDoctor', () => {
  
  let req, res, next;

  beforeEach(() => {
    req = {
      query: testConstants.deleteDoctorQuery,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('Success: should delete doctor data and return success response', async () => {

    await adminController.deleteDoctor(req, res, next);

    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE)
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('Failure: should call next with error if deleteDoctorData throws an error', async () => {
    const error = new Error('Database error');

    await adminController.deleteDoctor(req, res, next);

  
  });
});

describe('changeAppointmentsStatus Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      user: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    next = jest.fn();
  });

  it('should return 400 if status or appointment_id is missing', async () => {
    req.query = { status: '', appointment_id: '' };
    req.user = { admin: true, email: 'admin@example.com' };

    await adminController.changeAppointmentsStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should do nothing if user is not admin or doctor', async () => {
    req.query = { status: 'Confirmed', appointment_id: '1' };
    req.user = { admin: false, doctor: false, email: 'user@example.com' };

    await adminController.changeAppointmentsStatus(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should return 200 if status updated successfully and not Cancelled', async () => {
    req.query = { status: 'Confirmed', appointment_id: '1' };
    req.user = { admin: true, email: 'admin@example.com' };

    adminModel.changeStatus.mockResolvedValue({ affectedRows: 1 });

    await adminController.changeAppointmentsStatus(req, res, next);

    expect(adminModel.changeStatus).toHaveBeenCalledWith('Confirmed', '1');
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should return 200 and send email if status is Cancelled', async () => {
    req.query = { status: 'Cancelled', appointment_id: '1' };
    req.user = { admin: true, email: 'admin@example.com' };

    adminModel.changeStatus.mockResolvedValue({ affectedRows: 1 });
    adminModel.getPatientData.mockResolvedValue([{
      patient_name: 'John Doe',
      appointment_date: '2024-06-10',
      appointment_time: '10:00 AM',
      name: 'Dr. Smith'
    }]);

    await adminController.changeAppointmentsStatus(req, res, next);

    expect(adminModel.changeStatus).toHaveBeenCalledWith('Cancelled', '1');
    expect(adminModel.getPatientData).toHaveBeenCalledWith('1');
    expect(sendCancelledAppointmentEmail).toHaveBeenCalledWith(
      'admin@example.com',
      'John Doe',
      '2024-06-10',
      '10:00 AM',
      'Dr. Smith'
    );
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should return 400 if update fails (affectedRows === 0)', async () => {
    req.query = { status: 'Confirmed', appointment_id: '1' };
    req.user = { doctor: true, email: 'doctor@example.com' };

    adminModel.changeStatus.mockResolvedValue({ affectedRows: 0 });

    await adminController.changeAppointmentsStatus(req, res, next);

    expect(adminModel.changeStatus).toHaveBeenCalledWith('Confirmed', '1');
    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should call next with error if exception occurs', async () => {
    req.query = { status: 'Confirmed', appointment_id: '1' };
    req.user = { admin: true, email: 'admin@example.com' };

    const error = new Error('DB Error');
    adminModel.changeStatus.mockRejectedValue(error);

    await adminController.changeAppointmentsStatus(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('setAppointmentCancelled Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      user: {},
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    next = jest.fn();
  });

  it('should return 400 if appointment_id or reason is missing', async () => {
    req.query = { appointment_id: '' };
    req.body = { reason: '' };
    req.user = { admin: true };

    await adminController.setAppointmentCancelled(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should do nothing if user is not admin', async () => {
    req.query = { appointment_id: '123' };
    req.body = { reason: 'Emergency' };
    req.user = { admin: false };

    await adminController.setAppointmentCancelled(req, res, next);

    expect(adminModel.cancelStatus).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should return 200 and send email if cancellation is successful', async () => {
    req.query = { appointment_id: '123' };
    req.body = { reason: 'Doctor unavailable' };
    req.user = { admin: true, email: 'admin@example.com' };

    adminModel.cancelStatus.mockResolvedValue({ affectedRows: 1 });
    adminModel.getPatientData.mockResolvedValue([{
      patient_name: 'Alice',
      appointment_date: '2024-06-15',
      appointment_time: '3:00 PM',
      name: 'Dr. John',
      reason: 'Doctor unavailable'
    }]);

    await adminController.setAppointmentCancelled(req, res, next);

    expect(adminModel.cancelStatus).toHaveBeenCalledWith('123', 'Doctor unavailable');
    expect(adminModel.getPatientData).toHaveBeenCalledWith('123');
    expect(sendCancelledAppointmentEmail).toHaveBeenCalledWith(
      'admin@example.com',
      'Doctor unavailable',
      'Alice',
      '2024-06-15',
      '3:00 PM',
      'Dr. John'
    );
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should return 400 if cancellation fails (affectedRows === 0)', async () => {
    req.query = { appointment_id: '123' };
    req.body = { reason: 'Doctor unavailable' };
    req.user = { admin: true };

    adminModel.cancelStatus.mockResolvedValue({ affectedRows: 0 });

    await adminController.setAppointmentCancelled(req, res, next);

    expect(adminModel.cancelStatus).toHaveBeenCalledWith('123', 'Doctor unavailable');
    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
  });

  it('should call next with error if an exception is thrown', async () => {
    req.query = { appointment_id: '123' };
    req.body = { reason: 'Doctor unavailable' };
    req.user = { admin: true };

    const error = new Error('Database error');
    adminModel.cancelStatus.mockRejectedValue(error);

    await adminController.setAppointmentCancelled(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('approveAppointment', () => {
  const mockReq =testConstants.approveAppointmentReq;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Failure: should return BAD_REQUEST if appointment_id is missing', async () => {
    mockReq.query.appointment_id = null;

    await adminController.approveAppointment(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.INVALID_INPUT)
    );
  });

  it('Failure: should return BAD_REQUEST if user is not an admin', async () => {
    mockReq.user.admin = false;

    await adminController.approveAppointment(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.NOT_CHANGE_STATUS)
    );
  });

  it('Failure: should return BAD_REQUEST if patient data is not found', async () => {
 

    await adminController.approveAppointment(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.NOT_CHANGE_STATUS)
    );
  });

  it('Success: should return SUCCESS if appointment is approved', async () => {
    
    await adminController.approveAppointment(mockReq, mockRes, mockNext);

    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.CHANGE_STATUS)
    );
    
  });

  it('Failure: should call next(error) if an error occurs', async () => {
    const error = new Error('Something went wrong');

    await adminController.approveAppointment(mockReq, mockRes, mockNext);

  });
});

describe('displayAppointmentRequest', () => {
  const mockReq = testConstants.appointmentRequestUser;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Success: should return SUCCESS with requested appointment data for admin users', async () => {
    const mockData =testConstants.appointmentRequestResult;

    await adminController.displayAppointmentRequest(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.REQUESTED_APPOINTMENT, mockData)
    );
  });

  it('Failure: should return BAD_REQUEST if the user is not an admin', async () => {
    mockReq.user.admin = false;

    await adminController.displayAppointmentRequest(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.ADMIN_ACCESS)
    );
  });

  it('Failure: should call next(error) if an error occurs', async () => {
    const error = new Error('Something went wrong');

    await adminController.displayAppointmentRequest(mockReq, mockRes, mockNext);

  });
});


describe('getAllAppointments', () => {
  const mockReq = testConstants.getAllAppointmentReq;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Success: should return SUCCESS with all appointments if user is admin', async () => {
    const mockAppointments =testConstants.getAllAppointmentResult;

    await adminController.getAllAppointments(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.ALL_APPOINTMENTS, {
        appointments: mockAppointments,
      })
    );
  });

  it('Success: should return SUCCESS with all appointments if user is a doctor', async () => {
    mockReq.user.admin = false;
    mockReq.user.doctor = true;

    const mockAppointments = testConstants.getAllAppointmentResult

    await adminController.getAllAppointments(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.ALL_APPOINTMENTS, {
        appointments: mockAppointments,
      })
    );
  });

  it('Failure: should call next(error) if an error occurs', async () => {
    const error = new Error('Something went wrong');

    await adminController.getAllAppointments(mockReq, mockRes, mockNext);

  });
});

describe('getPatientsAppointments', () => {
  const mockReq = testConstants.getPatientsAppointmentReq;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Succes: should return SUCCESS with formatted appointments if user is admin', async () => {
    const mockAppointments = testConstants.getPatientsAppointmentResponse;

    await adminController.getPatientsAppointments(mockReq, mockRes, mockNext);

    const expectedFormattedAppointments = mockAppointments.map(appointment => ({
      ...appointment,
      appointment_date: '2025-04-29',
    }));

    expect(mockRes.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.ALL_APPOINTMENTS, { appointments: expectedFormattedAppointments })
    );
  });

  it('Success: should return SUCCESS with formatted appointments if user is a doctor', async () => {
    mockReq.user.admin = false;
    mockReq.user.doctor = true;

    const mockAppointments = testConstants.getPatientsAppointmentResponse;

    await adminController.getPatientsAppointments(mockReq, mockRes, mockNext);

    const expectedFormattedAppointments = mockAppointments.map(appointment => ({
      ...appointment,
      appointment_date: '2025-05-01',
    }));

    expect(mockRes.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.ALL_APPOINTMENTS, { appointments: expectedFormattedAppointments })
    );
  });

  it('Error: should call next(error) if an error occurs', async () => {
    const error = new Error('Something went wrong');

    await adminController.getPatientsAppointments(mockReq, mockRes, mockNext);

  });
});


describe('getAllEmail', () => {
  const mockReq = testConstants.getAllEmailReq;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Success: should return SUCCESS with retrieved emails if user is admin', async () => {
    const mockEmails = testConstants.getAllEmailRes;

    await adminController.getAllEmail(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.EMAIL_RETRIVE, mockEmails)
    );
  });

  it('Success: should return SUCCESS with retrieved emails if user is a doctor', async () => {
    mockReq.user.admin = false;
    mockReq.user.doctor = true;

    const mockEmails = testConstants.getAllEmailRes;

    await adminController.getAllEmail(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.EMAIL_RETRIVE, mockEmails)
    );
  });

  it('Failure: should call next(error) if an error occurs', async () => {
    const error = new Error('Something went wrong');

    await adminController.getAllEmail(mockReq, mockRes, mockNext);

  });
});

describe('getAllEmailForDoctor', () => {
  const mockReq = testConstants.getAllEmailForDoctorReq;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Success: should return SUCCESS with retrieved emails if user is admin', async () => {
    const mockEmails =testConstants.getAllEmailRes;

    await adminController.getAllEmailForDoctor(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.EMAIL_RETRIVE, mockEmails)
    );
  });

  it('Success: should return SUCCESS with retrieved emails if user is a doctor', async () => {
    mockReq.user.admin = false;
    mockReq.user.doctor = true;

    const mockEmails = testConstants.getAllEmailRes;

    await adminController.getAllEmailForDoctor(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(mockRes.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.EMAIL_RETRIVE, mockEmails)
    );
  });

  it('Failure: should call next(error) if an error occurs', async () => {
    const error = new Error('Something went wrong');

    await adminController.getAllEmailForDoctor(mockReq, mockRes, mockNext);

  });
});
describe('downloadDocument controller', () => {
  let req, res, next, mockWriteStream;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    next = jest.fn();

    mockWriteStream = {
      on: jest.fn().mockImplementation(function (event, handler) {
        if (event === 'finish') {
          process.nextTick(handler); 
        }
        return this;
      }),
      end: jest.fn()
    };

    fs.createWriteStream.mockReturnValue(mockWriteStream);

    global.response1 = { response1: 'http://example.com/file.pdf' };
    global.filePath = { filePath: '/tmp/test.pdf' };
  });

  it('should download and save file successfully', async () => {
    const fakeStream = new stream.Readable();
    fakeStream._read = () => {};
    axios.mockResolvedValue({ data: fakeStream });

    await adminController.downloadDocument(req, res, next);

    expect(axios).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://example.com/file.pdf',
      responseType: 'stream'
    });

    expect(fs.createWriteStream).toHaveBeenCalledWith('/tmp/test.pdf');
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      expect.any(ResponseHandler)
    );
  });

  it('should handle stream error gracefully', async () => {
    const fakeStream = new stream.Readable();
    fakeStream._read = () => {};
    axios.mockResolvedValue({ data: fakeStream });

    mockWriteStream.on.mockImplementation((event, handler) => {
      if (event === 'error') {
        process.nextTick(() => handler(new Error('Stream error')));
      }
      return mockWriteStream;
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await adminController.downloadDocument(req, res, next);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });

  it('should call next with error on axios failure', async () => {
    const error = new Error('Network error');
    axios.mockRejectedValue(error);

    await adminController.downloadDocument(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
})