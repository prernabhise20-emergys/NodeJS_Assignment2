const testConstants = require("../controllers/test.constants.js")
const userModel = require('../../models/userModel.js');
const userController=require('../../controllers/userController.js').default;
const { ResponseHandler, MessageHandler } = require("../../common/utility/handlers.js");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('bcryptjs');
const { SUCCESS_STATUS_CODE,
    SUCCESS_MESSAGE,
    ERROR_STATUS_CODE,
    ERROR_MESSAGE } = require("../../common/constants/statusConstant.js")
jest.mock("../../common/utility/handlers.js", () => ({
    ResponseHandler: jest.fn(),
    MessageHandler: jest.fn()
}));
jest.mock("../../common/utility/otpMail.js");
jest.mock('../../models/userModel.js');
jest.mock("../../models/adminModel.js"); 


describe('User controller test cases', () => {
    describe('register', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                body: testConstants.registerApiBody
            };

            res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            next = jest.fn();
        });

        it('Success: should create a new user', async () => {
          

            const mockResponse = new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.REGISTER_SUCCESS);

            await userController.register(req, res, next);

            expect(ResponseHandler).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.REGISTER_SUCCESS);
            expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
            expect(res.send).toHaveBeenCalledWith(mockResponse);
            expect(next).not.toHaveBeenCalled();
        });

        it('Failure: should return error if user already exists', async () => {
            const mockResponse = new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.ALREADY_REGISTER);
            userModel.checkIfUserExists.mockResolvedValue(testConstants.regitserId);
            await userController.register(req, res, next);
            expect(next).toHaveBeenCalledWith(mockResponse);

        });
    });

    describe('login', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                body: testConstants.loginApiBody
            };

            res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            next = jest.fn();
        });

        it('Success: login user using the email', async () => {
            const token = 'dnsacjhgxhndjsbhcbns';

            userModel.loginUser.mockResolvedValue();

            const mockResponse = new ResponseHandler(
                SUCCESS_STATUS_CODE.SUCCESS,
                SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
                token
            );

            await userController.login(req, res, next);

            expect(ResponseHandler).toHaveBeenCalledWith(
                SUCCESS_STATUS_CODE.SUCCESS,
                SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
                token
            );
           
        });

        it('Failure: should return error if user does not exist', async () => {
            userModel.loginUser.mockResolvedValue(null);

            const mockErrorResponse = new ResponseHandler(
                ERROR_STATUS_CODE.BAD_REQUEST,
                ERROR_MESSAGE.INVALID_USER
            );

            await userController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(mockErrorResponse);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
        });


        it('Failure: should return error if user does not provide email ', async () => {
            req.body.email=null;
            const mockErrorResponse = new ResponseHandler(
                ERROR_STATUS_CODE.BAD_REQUEST,
                ERROR_MESSAGE.LOGIN_CREDENTIAL
            );

            await userController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(mockErrorResponse);

        });

        it('Failure: should return error if user does not provide userCode ', async () => {
            req.body.userCode=null;

            const mockErrorResponse = new ResponseHandler(
                ERROR_STATUS_CODE.BAD_REQUEST,
                ERROR_MESSAGE.LOGIN_CREDENTIAL
            );

            await userController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(mockErrorResponse);
        });

        it('Failure: should return error if a deleted user attempts to log in', async () => {
            const mockResponse = new ResponseHandler(ERROR_STATUS_CODE.NOT_FOUND, SUCCESS_MESSAGE.USER_DELETED);            
            userModel.checkUserDeleteOrNot.mockResolvedValue(true);           
            await userController.login(req, res, next);    
            expect(next).toHaveBeenCalledWith(mockResponse);
        });      
    });

    describe("updateUser", () => {
        let req, res, next;
      
        beforeEach(() => {
          req = {
            body:testConstants.updateUserBody,
            user: {
              userid: testConstants.updateUserId
            }
          };
          res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
          };
          next = jest.fn();
        });
      
        it("Success: should successfully update user details and return a success response", async () => {
          userModel.updateUserData.mockResolvedValue(true); 
      
          const mockResponse = new ResponseHandler(
            SUCCESS_STATUS_CODE.SUCCESS,
            SUCCESS_MESSAGE.USER_UPDATE_SUCCESS_MSG
          );
      
          await userController.updateUser(req, res, next);
      
          expect(userModel.updateUserData).toHaveBeenCalledWith(
           testConstants.updateUserBody,
            testConstants.updateUserId
          );
          expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
          expect(res.send).toHaveBeenCalledWith(mockResponse);
          expect(next).not.toHaveBeenCalled(); 
        });
      
        it("Failure: should call next with an error if updateUserData throws an error", async () => {
          userModel.updateUserData.mockRejectedValue(new Error("Database error")); 
      
          const mockErrorResponse = new ResponseHandler(
            ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR,
            "Database error"
          );
      
          await userController.updateUser(req, res, next);
      
          expect(userModel.updateUserData).toHaveBeenCalledWith(
            testConstants.updateUserBody,
            testConstants.updateUserId 
          );
          expect(res.status).not.toHaveBeenCalled(); 
          expect(res.send).not.toHaveBeenCalled(); 
        });
      });


describe("deleteUser", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: testConstants.deleteUserBody
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it("Success: should successfully delete user and return a success response", async () => {
    userModel.checkAdminCount.mockResolvedValue(2);
    userModel.deleteUserData.mockResolvedValue(true); 

    const mockResponse = new ResponseHandler(
      SUCCESS_STATUS_CODE.SUCCESS,
      SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE
    );

    await userController.deleteUser(req, res, next);

    expect(userModel.checkAdminCount).toHaveBeenCalled();
    expect(userModel.deleteUserData).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(mockResponse);
    expect(next).not.toHaveBeenCalled(); 
  });

  it("Failure: should return error if admin is the only admin and tries to delete", async () => {
    userModel.checkAdminCount.mockResolvedValue(1); 
    const mockErrorResponse = new ResponseHandler(
      ERROR_STATUS_CODE.BAD_REQUEST,
      ERROR_MESSAGE.CANNOT_DELETE
    );

    await userController.deleteUser(req, res, next);

    expect(userModel.checkAdminCount).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(mockErrorResponse); 
    expect(res.status).not.toHaveBeenCalled(); 
    expect(res.send).not.toHaveBeenCalled(); 
  });

  it("Failure: should call next with an error if deleteUserData throws an error", async () => {
    userModel.checkAdminCount.mockResolvedValue(2); 
    userModel.deleteUserData.mockRejectedValue(new Error("Database error"));

    const mockErrorResponse = new ResponseHandler(
      ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR,
      "Database error"
    );

    await userController.deleteUser(req, res, next);

    expect(userModel.checkAdminCount).toHaveBeenCalled();
    expect(userModel.deleteUserData).toHaveBeenCalledWith(1); 
    expect(res.status).not.toHaveBeenCalled(); 
    expect(res.send).not.toHaveBeenCalled(); 
  });
}); 


describe("getUser", () => {
    let req, res, next;
  
    beforeEach(() => {
      req = {
        user: testConstants.getUserBody
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      next = jest.fn();
    });
  
    it("Success: should successfully retrieve user information if the user exists and is not deleted", async () => {
      const mockUser = testConstants.getUserResult;
      userModel.checkAlreadyExist.mockResolvedValue(true); 
      userModel.getUserData.mockResolvedValue(mockUser); 
  
      const mockResponse = new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.USER_INFO_SUCCESS_MESSAGE,
        mockUser
      );
  
      await userController.getUser(req, res, next);
  
      
    });
  
    it("Failure: should successfully retrieve deleted user information", async () => {
      const mockDeletedUserInfo = testConstants.getUserResult;
      userModel.checkAlreadyExist.mockResolvedValue(true);
      userModel.getDeleteUserInfo.mockResolvedValue(mockDeletedUserInfo); 
  
      const mockResponse = new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
        mockDeletedUserInfo
      );
  
      await userController.getUser(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
      expect(res.send).toHaveBeenCalledWith(mockResponse);
      expect(next).not.toHaveBeenCalled(); 
    });
  
    it("Failure: should return an error if the user does not exist", async () => {
      userModel.checkAlreadyExist.mockResolvedValue(false); 
      const mockErrorResponse = new ResponseHandler(
        ERROR_STATUS_CODE.NOT_FOUND,
        "User not found"
      );
  
      await userController.getUser(req, res, next);
  
      
    });
  
    it("Failure: should call next with an error if an unexpected error occurs", async () => {
      userModel.checkAlreadyExist.mockResolvedValue(true); 
      userModel.getUserData.mockRejectedValue(new Error("Database error")); 
      const mockErrorResponse = new ResponseHandler(
        ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Database error"
      );
  
      await userController.getUser(req, res, next);
  
    
    });
  });



describe("forgotPassword", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body:testConstants.forgotPasswordBody
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it("Success: should successfully send OTP when email exists", async () => {
    const mockName = testConstants.otpInformation.mockName;
    const mockOtp =testConstants.otpInformation.mockOtp;
    const mockHashOtp = testConstants.otpInformation.mockHashOtp;

    userModel.checkEmailExists.mockResolvedValue(true); 
    userModel.getName.mockResolvedValue(mockName);
    

    const mockResponse = new ResponseHandler(
      SUCCESS_STATUS_CODE.SUCCESS,
      SUCCESS_MESSAGE.OTP_SENT,
      { hashOtp: mockHashOtp }
    );

    await userController.forgotPassword(req, res, next);

    expect(userModel.checkEmailExists).toHaveBeenCalledWith(testConstants.forgotPasswordBody.email);
    expect(userModel.getName).toHaveBeenCalledWith(testConstants.forgotPasswordBody.email);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(mockResponse);
    expect(next).not.toHaveBeenCalled();
  });

  it("Failure: should return an error when email does not exist", async () => {
    userModel.checkEmailExists.mockResolvedValue(false); 

    const mockErrorResponse = new ResponseHandler(
      ERROR_STATUS_CODE.BAD_REQUEST,
      ERROR_MESSAGE.EMAIL_NOT_EXISTS
    );

    await userController.forgotPassword(req, res, next);

    expect(userModel.checkEmailExists).toHaveBeenCalledWith(testConstants.forgotPasswordBody.email);
    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(mockErrorResponse);
    expect(next).not.toHaveBeenCalled();
  });

  it("Failure: should call next with an error if an unexpected error occurs", async () => {
    userModel.checkEmailExists.mockRejectedValue(new Error("Unexpected error")); 

    const mockErrorResponse = new ResponseHandler(
      ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR,
      "Unexpected error"
    );

    await userController.forgotPassword(req, res, next);

    expect(res.status).not.toHaveBeenCalled(); 
    expect(res.send).not.toHaveBeenCalled(); 
  });

  it("Failure: should call next with an error if OTP hashing fails", async () => {
    const mockName = testConstants.otpInformation.mockName;
    userModel.checkEmailExists.mockResolvedValue(true); 
    userModel.getName.mockResolvedValue(mockName); 

    const mockErrorResponse = new ResponseHandler(
      ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR,
      "Hashing error"
    );

    await userController.forgotPassword(req, res, next);

  });
});

describe("resetPassword", () => {
    let req, res, next;
  
    beforeEach(() => {
      req = {
        body: testConstants.resetPasswordBody
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      next = jest.fn();
    });
  
    it("Success: should successfully update the password and return a success response", async () => {
      userModel.updatePassword.mockResolvedValue(true); 
  
      const mockResponse = new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.PASSWORD_UPDATE
      );
  
      await userController.resetPassword(req, res, next);
  
      expect(userModel.updatePassword).toHaveBeenCalledWith(testConstants.resetPasswordBody.email,testConstants.resetPasswordBody.newPassword);
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
      expect(res.send).toHaveBeenCalledWith(mockResponse);
      expect(next).not.toHaveBeenCalled(); 
    });
  
    it("Failure: should call next with an error if an unexpected error occurs", async () => {
      userModel.updatePassword.mockRejectedValue(new Error("Unexpected error")); 
  
      const mockErrorResponse = new ResponseHandler(
        ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR,
        "Unexpected error"
      );
  
      await userController.resetPassword(req, res, next);
  
    });
  
    it("Failure: should call next with an error if email or newPassword is not provided", async () => {
      req.body = {}; 
      const mockErrorResponse = new ResponseHandler(
        ERROR_STATUS_CODE.BAD_REQUEST,
        "Email and newPassword are required"
      );
  
      await userController.resetPassword(req, res, next);
  
  
    });
  });



describe('changePassword', () => {
  const mockRequest = (oldPassword, newPassword) => ({
    body: { oldPassword, newPassword },
    user: {
      userid:testConstants.changePasswordBody,
      user_password: bcrypt.hashSync('oldPassword', 10), 
    },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const next = jest.fn();

  it('Success: should successfully change the password when the old password is correct', async () => {
    const req = mockRequest('oldPassword', 'newPassword');
    const res = mockResponse();

    bcrypt.compare = jest.fn().mockResolvedValue(true);  
    bcrypt.hash = jest.fn().mockResolvedValue('hashedNewPassword'); 

    await userController.changePassword(req, res, next);

  });

  it('should return an error when the old password does not match', async () => {
    const req = mockRequest('wrongOldPassword', 'newPassword');
    const res = mockResponse();

    bcrypt.compare = jest.fn().mockResolvedValue(false);  

    await userController.changePassword(req, res, next);

 
  });

  it('should call next with an error if an unexpected error occurs', async () => {
    const req = mockRequest('oldPassword', 'newPassword');
    const res = mockResponse();
    const error = new Error('Unexpected error');
    const next = jest.fn();

    bcrypt.compare = jest.fn().mockRejectedValue(error);

    await userController.changePassword(req, res, next);

  });
});

describe('getDoctors', () => {

    it('Success: should successfully retrieve doctor info and return it', async () => {
      const mockDoctorInfo = testConstants.getDoctorResult; 
      const req = {}; 
      const res = {
        status: jest.fn().mockReturnThis(), 
        send: jest.fn(),  
      };
      const next = jest.fn();  
  
      userModel.getDoctorInfo.mockResolvedValue(mockDoctorInfo);
  
      await userController.getDoctors(req, res, next);
  
      expect(userModel.getDoctorInfo).toHaveBeenCalledTimes(1);
  
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
  
      expect(res.send).toHaveBeenCalledWith(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE, mockDoctorInfo)
      );
    });
  
    it('Failure: should call next with an error if an error occurs in getting doctor info', async () => {
      const req = {};  
      const res = {};  
      const next = jest.fn(); 
  
    
      await userController.getDoctors(req, res, next);
  
    });
  });

  describe('createAppointment', () => {

    it('Success: should successfully create an appointment if doctor is available', async () => {
      const req = {
        body: testConstants.createAppointmentBody,
      };
      const res = {
        status: jest.fn().mockReturnThis(),  
        send: jest.fn(),  
      };
      const next = jest.fn();  
  
      userModel.isDoctorAvailable.mockResolvedValue(true);
  
      const mockResult = { insertId: 123 };  
      userModel.createDoctorAppointment.mockResolvedValue(mockResult);
  
      await userController.createAppointment(req, res, next);
    
      expect(userModel.createDoctorAppointment).toHaveBeenCalledWith(testConstants.createAppointmentBody.patient_id,testConstants.createAppointmentBody.doctor_id, testConstants.createAppointmentBody.date, testConstants.createAppointmentBody.time);
  
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
  
      expect(res.send).toHaveBeenCalledWith(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.APPOINTMENT_BOOKED, { appointment_id: 123 })
      );
    });
  
    it('Failure: should return an error if doctor is not available', async () => {
      const req = {
        body: testConstants.createAppointmentBody,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      userModel.isDoctorAvailable.mockResolvedValue(false);
  
      await userController.createAppointment(req, res, next);
    
      expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
  
      expect(res.send).toHaveBeenCalledWith(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.BOOK_SLOT)
      );
    });
  
    it('Failure: should call next with an error if an unexpected error occurs', async () => {
      const req = {
        body:testConstants.createAppointmentBody,
      };
      const res = {};
      const next = jest.fn();
  
      const mockError = new Error('Database Error');
      userModel.isDoctorAvailable.mockRejectedValue(mockError);
  
      await userController.createAppointment(req, res, next);
  
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  
describe('getDoctorAvailability', () => {

    it('should return doctor availability details successfully', async () => {
      const req = {
        query: { doctor_id: 1 },  
        body: { date: '2025-04-30' }, 
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      const mockAvailableTimes = [
        {
          doctorInTime: '9:00 AM',
          doctorOutTime: '5:00 PM',
          appointment_time: '2025-04-30T09:30:00',
          status: 'Scheduled',
        },
        {
          doctorInTime: '9:00 AM',
          doctorOutTime: '5:00 PM',
          appointment_time: '2025-04-30T10:30:00',
          status: 'Pending',
        },
        {
          doctorInTime: '9:00 AM',
          doctorOutTime: '5:00 PM',
          appointment_time: '2025-04-30T11:30:00',
          status: 'Scheduled',
        },
      ];
      userModel.checkDoctorAvailability.mockResolvedValue(mockAvailableTimes);
  
      await userController.getDoctorAvailability(req, res, next);
  
      expect(userModel.checkDoctorAvailability).toHaveBeenCalledWith(1, '2025-04-30');
  
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
  
      expect(res.send).toHaveBeenCalledWith(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.AVAILABLE_SLOT, {
          doctorInTime: '9:00 AM',
          doctorOutTime: '5:00 PM',
          scheduleSlots: ['2025-04-30T09:30:00', '2025-04-30T11:30:00'],
          pendingSlots: ['2025-04-30T10:30:00'],
        })
      );
    });
  
    it('should return a "Not Available" status if no doctor times are available', async () => {
      const req = {
        query: { doctor_id: 1 },
        body: { date: '2025-04-30' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      userModel.checkDoctorAvailability.mockResolvedValue([]);
  
      await userController.getDoctorAvailability(req, res, next);
  
      expect(userModel.checkDoctorAvailability).toHaveBeenCalledWith(1, '2025-04-30');
  
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
  
      expect(res.send).toHaveBeenCalledWith(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.AVAILABLE_SLOT, {
          doctorInTime: 'Not Available',
          doctorOutTime: 'Not Available',
          scheduleSlots: [],
          pendingSlots: [],
        })
      );
    });
  
    it('should return an error if an unexpected error occurs', async () => {
      const req = {
        query: { doctor_id: 1 },
        body: { date: '2025-04-30' },
      };
      const res = {};
      const next = jest.fn();
  
      const mockError = new Error('Database Error');
      userModel.checkDoctorAvailability.mockRejectedValue(mockError);
  
      await userController.getDoctorAvailability(req, res, next);
  
      expect(next).toHaveBeenCalledWith(mockError);
    });
  
    it('should return an error if doctor_id or date is missing from the request', async () => {
      const req = {
        query: {},  
        body: {},   
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await userController.getDoctorAvailability(req, res, next);
 
    });
  });

  describe('searchDoctor', () => {

    it('should return doctor information successfully when keyword is provided', async () => {
      const req = {
        query: { keyword: 'Cardiologist' },  
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      const mockDoctorData = [
        { id: 1, name: 'Dr. John Doe', specialty: 'Cardiologist' },
        { id: 2, name: 'Dr. Jane Smith', specialty: 'Cardiologist' },
      ];
      userModel.getSearchedDoctor.mockResolvedValue(mockDoctorData);
  
      await userController.searchDoctor(req, res, next);
  
      expect(userModel.getSearchedDoctor).toHaveBeenCalledWith('Cardiologist');
  
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
  
      expect(res.send).toHaveBeenCalledWith(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DOCTOR_INFO_SUCCESS_MESSAGE, mockDoctorData)
      );
    });
  
    it('should return an error if keyword is not provided in the request', async () => {
      const req = {
        query: {},  
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      await userController.searchDoctor(req, res, next);
  
      expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
  
      expect(res.send).toHaveBeenCalledWith(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.KEYWORD_REQUIRED)
      );
    });
  
    it('should return an empty list if no doctors are found for the given keyword', async () => {
      const req = {
        query: { keyword: 'Neurologist' },  
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();
  
      userModel.getSearchedDoctor.mockResolvedValue([]);
  
      await userController.searchDoctor(req, res, next);
  
      expect(userModel.getSearchedDoctor).toHaveBeenCalledWith('Neurologist');
  
      expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
  
      expect(res.send).toHaveBeenCalledWith(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DOCTOR_INFO_SUCCESS_MESSAGE, [])
      );
    });
  
    it('should return an error if an unexpected error occurs', async () => {
      const req = {
        query: { keyword: 'Orthopedist' }, 
      };
      const res = {};
      const next = jest.fn();
  
      const mockError = new Error('Database Error');
      userModel.getSearchedDoctor.mockRejectedValue(mockError);
  
      await userController.searchDoctor(req, res, next);
  
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('appointmentHistory', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {
        patient_id: '12345'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 400 if patient_id is missing', async () => {
    req.query.patient_id = null; 

    await userController.appointmentHistory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
    expect(next).not.toHaveBeenCalled();
  });

  it('should call getAppointmentHistory and return 200 with the history on success', async () => {
    const mockHistory = [
      { appointment_id: '1', date: '2023-05-01', doctor: 'Dr. A' },
      { appointment_id: '2', date: '2023-06-01', doctor: 'Dr. B' }
    ];

    userModel.getAppointmentHistory.mockResolvedValue(mockHistory); 

    await userController.appointmentHistory(req, res, next);

    expect(userModel.getAppointmentHistory).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
        data: mockHistory
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if getAppointmentHistory fails', async () => {
    userModel.getAppointmentHistory.mockRejectedValue(new Error('Database error'));

    await userController.appointmentHistory(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});

describe('rescheduleAppointment', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        doctor_id: '1',
        date: '2025-06-01',
        time: '10:00 AM',
        disease_type: 'Flu',
        disease_description: 'Common cold symptoms'
      },
      query: {
        appointment_id: '12345'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 400 if any required field is missing', async () => {
    req.body.doctor_id = null;

    await userController.rescheduleAppointment(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
    expect(next).not.toHaveBeenCalled();
  });

  it('should successfully reschedule the appointment and return 200', async () => {
    userModel.updateDoctorAppointment.mockResolvedValue(true); 

    await userController.rescheduleAppointment(req, res, next);

    expect(userModel.updateDoctorAppointment).toHaveBeenCalledWith(
      '1', '2025-06-01', '10:00 AM', 'Flu', 'Common cold symptoms', '12345'
    );
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: SUCCESS_MESSAGE.APPOINTMENT_RESCHEDULE
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should forward error to next middleware if an error occurs during rescheduling', async () => {
    userModel.updateDoctorAppointment.mockRejectedValue(new Error('Database error'));

    await userController.rescheduleAppointment(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});

describe('getAppointmentData ', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {
        appointment_id: '12345'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 400 if appointment_id is missing', async () => {
    req.query.appointment_id = null; 

    await userController.getAppointmentData(req, res, next);

    expect(res.status).toHaveBeenCalledWith(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.send).toHaveBeenCalledWith(expect.any(ResponseHandler));
    expect(next).not.toHaveBeenCalled();
  });

  it('should successfully retrieve appointment data and return 200', async () => {
    const mockDoctorInfo = { name: 'Dr. Smith', specialization: 'Cardiology' };
    userModel.getAppointmentInfo.mockResolvedValue(mockDoctorInfo);

    await userController.getAppointmentData(req, res, next);

    expect(userModel.getAppointmentInfo).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: SUCCESS_MESSAGE.APPOINTMENT_INFO_SUCCESS_MESSAGE,
        data: mockDoctorInfo
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should forward error to next middleware if an error occurs', async () => {
    userModel.getAppointmentInfo.mockRejectedValue(new Error('Database error'));

    await userController.getAppointmentData(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
})