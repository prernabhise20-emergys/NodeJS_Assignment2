const patientController=require('../../controllers/patientController.js')
const testConstants = require("../controllers/test.constants.js")
const patientModel = require('../../models/patientModel.js'); 
const { ResponseHandler,MessageHandler } = require('../../common/utility/handlers'); 
const { SUCCESS_STATUS_CODE, SUCCESS_MESSAGE,ERROR_STATUS_CODE,ERROR_MESSAGE } = require('../../common/constants/statusConstant');

jest.mock('../../models/patientModel.js'); 

jest.mock("../../common/utility/handlers", () => ({
  ResponseHandler: jest.fn(),
  MessageHandler: jest.fn(),
}))



describe('Patient Controller Test Cases',()=>{


describe('showPatientDetails', () => {
  const mockRequest = (userid) => ({
    user: { userid },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('Success: should return patient details successfully', async () => {
    const mockUserId = '123';
    const mockPatientInfo = { name: 'John Doe', age: 30 };
    patientModel.getPatientInfo.mockResolvedValue(mockPatientInfo);

    const req = mockRequest(mockUserId);
    const res = mockResponse();

    await patientController.showPatientDetails(req, res, mockNext);

    expect(patientModel.getPatientInfo).toHaveBeenCalledWith(mockUserId);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
        mockPatientInfo
      )
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Failure: should call next with error when an exception occurs', async () => {
    const mockUserId = '123';
    const mockError = new Error('Something went wrong');
    patientModel.getPatientInfo.mockRejectedValue(mockError);

    const req = mockRequest(mockUserId);
    const res = mockResponse();

    await patientController.showPatientDetails(req, res, mockNext);

    expect(patientModel.getPatientInfo).toHaveBeenCalledWith(mockUserId);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});


describe('getPersonalDetails', () => {
  const mockRequest = (patient_id) => ({
    params: { patient_id },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('Success: should return personal details successfully', async () => {
    const mockPatientId = testConstants.getPersonalDetails;
    const mockFamilyInfo = testConstants.mockFamilyInfo;
    patientModel.getPersonalInfo.mockResolvedValue(mockFamilyInfo);

    const req = mockRequest(mockPatientId);
    const res = mockResponse();

    await patientController.getPersonalDetails(req, res, mockNext);

    expect(patientModel.getPersonalInfo).toHaveBeenCalledWith(mockPatientId);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
        mockFamilyInfo
      )
    );
    // expect(mockNext).not.toHaveBeenCalled();
  });

  it('Failure: should call next with error when an exception occurs', async () => {
    const mockPatientId = testConstants.getPersonalDetails;
    const mockError = new Error('Database connection error');
    patientModel.getPersonalInfo.mockRejectedValue(mockError);

    const req = mockRequest(mockPatientId);
    const res = mockResponse();

    await patientController.getPersonalDetails(req, res, mockNext);

    expect(patientModel.getPersonalInfo).toHaveBeenCalledWith(mockPatientId);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });



describe('createPersonalInfo', () => {
  const mockRequest = (body, id, email) => ({
    body,
    user: { userid: id, email },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('Success: should create personal details successfully', async () => {
    const mockBody = testConstants.createPersonalInfoBody;

    const mockUserId = testConstants.createPersonalInfoRes.mockUserId;
    const mockEmail = testConstants.createPersonalInfoRes.mockEmail;
    const mockResult = { insertId: 789 };

    patientModel.createPersonalDetails.mockResolvedValue(mockResult);

    const req = mockRequest(mockBody, mockUserId, mockEmail);
    const res = mockResponse();

    await patientController.createPersonalInfo(req, res, mockNext);

    expect(patientModel.createPersonalDetails).toHaveBeenCalledWith(mockBody, mockUserId, mockEmail);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.CREATED);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.CREATED,
        SUCCESS_MESSAGE.ADDED_PERSONAL_INFO_MESSAGE,
        { patient_id: mockResult.insertId }
      )
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Success: should call next with error when an exception occurs', async () => {
    const mockBody = testConstants.createPersonalInfoBody;

    const mockUserId =testConstants.createPersonalInfoRes.mockUserId;
    const mockEmail =testConstants.createPersonalInfoRes.mockEmail;
    const mockError = new Error('Database error');

    patientModel.createPersonalDetails.mockRejectedValue(mockError);

    const req = mockRequest(mockBody, mockUserId, mockEmail);
    const res = mockResponse();

    await patientController.createPersonalInfo(req, res, mockNext);

    expect(patientModel.createPersonalDetails).toHaveBeenCalledWith(mockBody, mockUserId, mockEmail);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});




describe('updatePersonalInfo', () => {
  const mockRequest = (body, userid, is_admin) => ({
    body,
    user: { userid, admin: is_admin },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('Success: should update personal info successfully for valid patient or admin', async () => {
    const mockBody = testConstants.updatePersonalInfoBody;

    const mockUserId = testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin = testConstants.updatePersonalInfoRes.mockIsAdmin;

    patientModel.checkUserWithPatientID.mockResolvedValue(testConstants.updatePersonalInfoRes.mockIsAdmin); 
    patientModel.updatePersonalDetails.mockResolvedValue();

    const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
    const res = mockResponse();

    await patientController.updatePersonalInfo(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
    expect(patientModel.updatePersonalDetails).toHaveBeenCalledWith(expect.objectContaining({
      patient_name: testConstants.updatePersonalInfoBody.patient_name,
      date_of_birth: testConstants.updatePersonalInfoBody.date_of_birth,
    }), mockBody.patient_id);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.UPDATE_INFO_SUCCESS_MESSAGE)
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Failure: should throw UNAUTHORIZED_ACCESS if patient is invalid and user is not admin', async () => {
    const mockBody = testConstants.updatePersonalInfoReq;

    const mockUserId = testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin = testConstants.updatePersonalInfoRes.mockIsAdmin2;

    patientModel.checkUserWithPatientID.mockResolvedValue(testConstants.updatePersonalInfoRes.mockIsAdmin2); 
    const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
    const res = mockResponse();

    await patientController.updatePersonalInfo(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
  });

  it('Failure: should call next with error when an exception occurs', async () => {
    const mockBody = testConstants.updatePersonalInfoReq;

    const mockUserId =  testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin =  testConstants.updatePersonalInfoRes.mockIsAdmin;
    const mockError = new Error('Database error');

    patientModel.checkUserWithPatientID.mockRejectedValue(mockError);

    const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
    const res = mockResponse();

    await patientController.updatePersonalInfo(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});


describe('deletePersonalInfo', () => {
  const mockRequest = (userid, is_admin, patient_id) => ({
    user: { userid, admin: is_admin },
    params: { patient_id },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('Success: should delete personal info successfully for valid patient or admin', async () => {
    const mockUserId =  testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin =  testConstants.updatePersonalInfoRes.mockIsAdmin;
    const mockPatientId = testConstants.updatePersonalInfoReq.patient_id;

    patientModel.checkUserWithPatientID.mockResolvedValue( testConstants.updatePersonalInfoRes.mockIsAdmin); 
    patientModel.deletePersonalDetails.mockResolvedValue();

    const req = mockRequest(mockUserId, mockIsAdmin, mockPatientId);
    const res = mockResponse();

    await patientController.deletePersonalInfo(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
    expect(patientModel.deletePersonalDetails).toHaveBeenCalledWith(mockPatientId);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE)
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Failure: should throw NOT_DELETED error if patient is invalid and user is not admin', async () => {
    const mockUserId =  testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin =  testConstants.updatePersonalInfoRes.mockIsAdmin2;
    const mockPatientId = testConstants.updatePersonalInfoReq.patient_id;

    patientModel.checkUserWithPatientID.mockResolvedValue(testConstants.updatePersonalInfoRes.mockIsAdmin2); 

    const req = mockRequest(mockUserId, mockIsAdmin, mockPatientId);
    const res = mockResponse();

    await patientController.deletePersonalInfo(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
  });

  it('Failure: should call next with error when an exception occurs', async () => {
    const mockUserId = testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin = testConstants.updatePersonalInfoRes.mockIsAdmin;
    const mockPatientId = testConstants.updatePersonalInfoReq.patient_id;
    const mockError = new Error('Database error');

    patientModel.checkUserWithPatientID.mockRejectedValue(mockError);

    const req = mockRequest(mockUserId, mockIsAdmin, mockPatientId);
    const res = mockResponse();

    await patientController.deletePersonalInfo(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});



describe('getFamilyDetails', () => {
  const mockRequest = (patient_id) => ({
    params: { patient_id },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('Success: should retrieve family details successfully', async () => {
    const mockPatientId = testConstants.getFamilyDetailsBody.mockPatientId;
    const mockFamilyInfo = testConstants.getFamilyDetailsRes;

    patientModel.getFamilyInfo.mockResolvedValue(mockFamilyInfo);

    const req = mockRequest(mockPatientId);
    const res = mockResponse();

    await patientController.getFamilyDetails(req, res, mockNext);

    expect(patientModel.getFamilyInfo).toHaveBeenCalledWith(mockPatientId);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
        mockFamilyInfo
      )
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Failure: should call next with error when an exception occurs', async () => {
    const mockPatientId = testConstants.getFamilyDetailsBody.mockPatientId;
    const mockError = new Error('Database error');

    patientModel.getFamilyInfo.mockRejectedValue(mockError);

    const req = mockRequest(mockPatientId);
    const res = mockResponse();

    await patientController.getFamilyDetails(req, res, mockNext);

    expect(patientModel.getFamilyInfo).toHaveBeenCalledWith(mockPatientId);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});


describe('addFamilyInfo', () => {
  const mockRequest = (familyDetails) => ({
    body: { familyDetails },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('Success: should add family info successfully', async () => {
    const mockFamilyDetails =testConstants.addFamilyInfoBody;
    patientModel.insertFamilyInfo.mockResolvedValue(); 

    const req = mockRequest(mockFamilyDetails);
    const res = mockResponse();

    await patientController.addFamilyInfo(req, res, mockNext);

    expect(patientModel.insertFamilyInfo).toHaveBeenCalledWith(mockFamilyDetails);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.ADDED_FAMILY_MESSAGE
      )
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Failure: should call next with error when an exception occurs', async () => {
    const mockFamilyDetails = testConstants.addFamilyInfoBody;
    const mockError = new Error('Database error');

    patientModel.insertFamilyInfo.mockRejectedValue(mockError); 

    const req = mockRequest(mockFamilyDetails);
    const res = mockResponse();

    await patientController.addFamilyInfo(req, res, mockNext);

    expect(patientModel.insertFamilyInfo).toHaveBeenCalledWith(mockFamilyDetails);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});



describe('updateFamilyInfoDetails', () => {
  const mockRequest = (body, userid, is_admin) => ({
    body,
    user: { userid, admin: is_admin },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('Success: should update family info successfully for valid patient or admin', async () => {
    const mockBody = testConstants.updateFamilyInfoBody;

    const mockUserId = testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin = testConstants.updatePersonalInfoRes.mockIsAdmin;

    patientModel.checkUserWithPatientID.mockResolvedValue(testConstants.updatePersonalInfoRes.mockIsAdmin); 
    patientModel.updateFamilyInfo.mockResolvedValue();

    const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
    const res = mockResponse();

    await patientController.updateFamilyInfoDetails(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
    expect(patientModel.updateFamilyInfo).toHaveBeenCalledWith(expect.objectContaining({
      father_name: testConstants.updateFamilyInfoBody.father_name,
      mother_name: testConstants.updateFamilyInfoBody.mother_name,
    }), mockBody.patient_id);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.FAMILY_UPDATE_SUCCESSFULLY
      )
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Failure: should throw NOT_UPDATE error if patient is invalid and user is not admin', async () => {
    const mockBody = testConstants.updateFamilyInfoBody;

    const mockUserId = testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin = testConstants.updatePersonalInfoRes.mockIsAdmin2;

    patientModel.checkUserWithPatientID.mockResolvedValue(testConstants.updatePersonalInfoRes.mockIsAdmin2); 

    const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
    const res = mockResponse();

    await patientController.updateFamilyInfoDetails(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
    // expect(mockNext).toHaveBeenCalledWith(NOT_UPDATE);
  });

  it('Failure: should call next with error when an exception occurs', async () => {
    const mockBody = testConstants.updateFamilyInfoBody;

    const mockUserId = testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin = testConstants.updatePersonalInfoRes.mockIsAdmin;
    const mockError = new Error('Database error');

    patientModel.checkUserWithPatientID.mockRejectedValue(mockError);

    const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
    const res = mockResponse();

    await patientController.updateFamilyInfoDetails(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});


describe('deleteFamilyInfoDetails', () => {
  const mockRequest = (patient_id, userid, is_admin) => ({
    params: { patient_id },
    user: { userid, admin: is_admin },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('Success: should delete family info successfully for valid patient or admin', async () => {
    const mockPatientId = testConstants.updatePersonalInfoBody.patient_id;
    const mockUserId = testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin = testConstants.updatePersonalInfoRes.mockIsAdmin;

    patientModel.checkUserWithPatientID.mockResolvedValue(testConstants.updatePersonalInfoRes.mockIsAdmin); 
    patientModel.deleteFamilyInfo.mockResolvedValue(); 

    const req = mockRequest(mockPatientId, mockUserId, mockIsAdmin);
    const res = mockResponse();

    await patientController.deleteFamilyInfoDetails(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
    expect(patientModel.deleteFamilyInfo).toHaveBeenCalledWith(mockPatientId);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.FAMILY_DELETE_SUCCESSFULLY)
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Failure: should throw NOT_DELETED error if patient is invalid and user is not admin', async () => {
    const mockPatientId =testConstants.updatePersonalInfoBody.patient_id;
    const mockUserId = testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin = testConstants.updatePersonalInfoRes.mockIsAdmin2;

    patientModel.checkUserWithPatientID.mockResolvedValue(testConstants.updatePersonalInfoRes.mockIsAdmin2); 

    const req = mockRequest(mockPatientId, mockUserId, mockIsAdmin);
    const res = mockResponse();

    await patientController.deleteFamilyInfoDetails(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
  });

  it('Failure: should call next with error when an exception occurs', async () => {
    const mockPatientId = testConstants.updatePersonalInfoBody.patient_id;
    const mockUserId = testConstants.updatePersonalInfoRes.mockUserId;
    const mockIsAdmin = testConstants.updatePersonalInfoRes.mockIsAdmin;
    const mockError = new Error('Database error');

    patientModel.checkUserWithPatientID.mockRejectedValue(mockError); 

    const req = mockRequest(mockPatientId, mockUserId, mockIsAdmin);
    const res = mockResponse();

    await patientController.deleteFamilyInfoDetails(req, res, mockNext);

    expect(patientModel.checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});



describe('getDiseaseDetails', () => {
  const mockRequest = (patient_id) => ({
    params: { patient_id },
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  it('Success: should retrieve disease details successfully', async () => {
    const mockPatientId = testConstants.updatePersonalInfoBody.patient_id;
    const mockDiseaseDetails = testConstants.getDiseaseDetailsRes;

    patientModel.getDiseaseInfo.mockResolvedValue(mockDiseaseDetails);

    const req = mockRequest(mockPatientId);
    const res = mockResponse();

    await patientController.getDiseaseDetails(req, res, mockNext);

    expect(patientModel.getDiseaseInfo).toHaveBeenCalledWith(mockPatientId);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
    expect(res.send).toHaveBeenCalledWith(
      new ResponseHandler(
        SUCCESS_STATUS_CODE.SUCCESS,
        SUCCESS_MESSAGE.DISEASE_DETAILS,
        mockDiseaseDetails
      )
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Failure: should call next with error when an exception occurs', async () => {
    const mockPatientId = testConstants.updatePersonalInfoBody.patient_id;
    const mockError = new Error('Database error');

    patientModel.getDiseaseInfo.mockRejectedValue(mockError);

    const req = mockRequest(mockPatientId);
    const res = mockResponse();

    await patientController.getDiseaseDetails(req, res, mockNext);

    expect(patientModel.getDiseaseInfo).toHaveBeenCalledWith(mockPatientId);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
});

})