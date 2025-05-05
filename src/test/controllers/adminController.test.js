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

    expect(next).toHaveBeenCalledWith(expect.any(Error));
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

describe('changeAppointmentsStatus', () => {
  let req, res, next;

  beforeEach(() => {
    req = testConstants.changeAppointmentsStatusReq;

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  it('Failure: should return BAD_REQUEST if status or appointment_id is missing', async () => {
    req.query = {}; 

    await adminController.changeAppointmentsStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, 'Invalid input')
    );
  });

  it('Success: should call changeStatus and return success response for admin user', async () => {

    await adminController.changeAppointmentsStatus(req, res, next);

    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, 'Status changed successfully')
    );
  });

  it('Success: should send cancellation email if status is Cancelled', async () => {
    
    await adminController.changeAppointmentsStatus(req, res, next);

  });

  it('Failure: should return BAD_REQUEST if changeStatus fails', async () => {

    await adminController.changeAppointmentsStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, 'Could not change status')
    );
  });

  it('Failure: should call next with an error if an exception occurs', async () => {
    const error = new Error('Something went wrong');

    await adminController.changeAppointmentsStatus(req, res, next);

  });
});

describe('setAppointmentCancelled', () => {
  let req, res, next;

  beforeEach(() => {
    req = testConstants.appointmentCancelledBody;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('Success: should cancel the appointment and send email if admin', async () => {
  

    await adminController.setAppointmentCancelled(req, res, next);
  });

  it('Failure: should return BAD_REQUEST if appointment_id is missing', async () => {
    req.query.appointment_id = null;

    await adminController.setAppointmentCancelled(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(
      expect.any(ResponseHandler)
    );
  });

  it('Failure: should return BAD_REQUEST if cancelStatus fails', async () => {

    await adminController.setAppointmentCancelled(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(
      expect.any(ResponseHandler)
    );
  });

  it('Failure: should call next with error if an exception occurs', async () => {
    const error = new Error('Something went wrong');
    await adminController.setAppointmentCancelled(req, res, next);

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

})