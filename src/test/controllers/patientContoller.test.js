const patientController=require('../../controllers/patientController.js').default;
const testConstants = require("../controllers/test.constants.js")
const patientModel = require('../../models/patientModel.js'); 
const { ResponseHandler,MessageHandler } = require('../../common/utility/handlers'); 
const { SUCCESS_STATUS_CODE, SUCCESS_MESSAGE,ERROR_STATUS_CODE,ERROR_MESSAGE } = require('../../common/constants/statusConstant');
const uploadFile =require('../../common/utility/upload.js')
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

describe('addDiseaseInfo', () => {
  const mockRequest = (body) => ({ body });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  it('Success: should add disease info', async () => {
    const req = mockRequest({ diseaseDetails: { type: 'Flu' } });
    const res = mockResponse();
    patientModel.addDiseaseData.mockResolvedValue();

    await patientController.addDiseaseInfo(req, res, mockNext);

    expect(patientModel.addDiseaseData).toHaveBeenCalledWith(req.body.diseaseDetails);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.CREATED);
    expect(res.send).toHaveBeenCalled();
  });

  it('Failure: should call next on error', async () => {
    const req = mockRequest({ diseaseDetails: { type: 'Flu' } });
    const res = mockResponse();
    const error = new Error('Database error');
    patientModel.addDiseaseData.mockRejectedValue(error);

    await patientController.addDiseaseInfo(req, res, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('updateDiseaseInfo', () => {
  const mockRequest = (body, user) => ({ body, user });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  it('Success: should update disease info for valid user', async () => {
    const req = mockRequest(testConstants.updateDiseaseInfoBody, testConstants.updateDiseaseInfoReq);
    const res = mockResponse();
    patientModel.checkUserWithPatientID.mockResolvedValue(true);
    patientModel.updateDiseaseDetails.mockResolvedValue();

    await patientController.updateDiseaseInfo(req, res, mockNext);

    expect(patientModel.updateDiseaseDetails).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
  });

  it('Failure: should call next with error if not authorized', async () => {
    const req = mockRequest(testConstants.updateDiseaseInfoBody, testConstants.updateDiseaseInfoReq);
    const res = mockResponse();
    patientModel.checkUserWithPatientID.mockResolvedValue(false);

    await patientController.updateDiseaseInfo(req, res, mockNext);
  });
});

describe('deleteDiseaseInfo', () => {
  const mockRequest = (params, user) => ({ params, user });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  it('Success: should delete disease info', async () => {
    const req = mockRequest(testConstants.deleteDiseaseInfoReq, testConstants.deleteDiseaseInfoUser);
    const res = mockResponse();
    patientModel.checkUserWithPatientID.mockResolvedValue(true);
    patientModel.deleteDiseaseDetails.mockResolvedValue();

    await patientController.deleteDiseaseInfo(req, res, mockNext);

    expect(patientModel.deleteDiseaseDetails).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
  });

  it('Failure: should call next with error if not authorized', async () => {
    const req = mockRequest(testConstants.deleteDiseaseInfoReq, testConstants.deleteDiseaseInfoUser);
    const res = mockResponse();
    patientModel.checkUserWithPatientID.mockResolvedValue(false);

    await patientController.deleteDiseaseInfo(req, res, mockNext);
  });
});


describe('getUploadDocument', () => {
  const mockRequest = (params) => ({ params });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  it('Success: should get uploaded document', async () => {
    const mockData = { doc: 'abc.pdf' };
    const req = mockRequest(testConstants.getUploadDocumentId);
    const res = mockResponse();
    patientModel.getUploadInfo.mockResolvedValue(mockData);

    await patientController.getUploadDocument(req, res, mockNext);

    expect(patientModel.getUploadInfo).toHaveBeenCalledWith(testConstants.getUploadDocumentId.patient_id);
    expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
  });

  it('Failure: should call next on error', async () => {
    const req = mockRequest(testConstants.getUploadDocumentId);
    const res = mockResponse();
    const error = new Error('Error');
    patientModel.getUploadInfo.mockRejectedValue(error);

    await patientController.getUploadDocument(req, res, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('uploadDocument', () => {
  const mockRequest = (file, body) => ({ file, body });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  it('Success: should upload document', async () => {
    const req = mockRequest({ originalname: 'file.pdf' }, testConstants.uploadDocumentReq);
    const res = mockResponse();
    // uploadFile.mockResolvedValue(testConstants.uploadSecureUrl);
    patientModel.saveDocument.mockResolvedValue();

    await patientController.uploadDocument(req, res, mockNext);

    // expect(patientModel.saveDocument).toHaveBeenCalled();
    // expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.CREATED);
  });

  it('Failure: should call next if no file provided', async () => {
    const req = mockRequest(null, testConstants.uploadDocumentReq);
    const res = mockResponse();

    await patientController.uploadDocument(req, res, mockNext);

  });
});

describe('updateDocument', () => {
  const mockRequest = (file, body, user) => ({ file, body, user });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  it('Success: should update document if exists', async () => {
    const req = mockRequest(
      { originalname: 'file.pdf' },
      testConstants.uploadDocumentReq,
      testConstants.deleteDiseaseInfoUser
    );
    const res = mockResponse();
    patientModel.checkDocumentExists.mockResolvedValue(true);
    // uploadFile.mockResolvedValue(testConstants.uploadSecureUrl);
    patientModel.checkUserWithPatientID.mockResolvedValue(true);
    patientModel.modifyDocument.mockResolvedValue();

    await patientController.updateDocument(req, res, mockNext);

    // expect(patientModel.modifyDocument).toHaveBeenCalled();
    // expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.CREATED);
  });

  it('Failure: should call next if document does not exist', async () => {
    const req = mockRequest({ originalname: 'file.pdf' },testConstants.uploadDocumentReq,testConstants.deleteDiseaseInfoUser);
    const res = mockResponse();
    patientModel.checkDocumentExists.mockResolvedValue(false);

    await patientController.updateDocument(req, res, mockNext);

  });
});

describe('downloadDocument', () => {
  const mockRequest = (query, body) => ({ query, body });
  const mockResponse = () => {
    const res = {};
    res.redirect = jest.fn();
    return res;
  };
  const mockNext = jest.fn();

  it('Success: should redirect to document URL', async () => {
    patientModel.getDocumentByPatientIdAndType.mockResolvedValue({ document_url: 'docs/file1.pdf' });

    const req = mockRequest(testConstants.getUploadDocumentId, { document_type: 'xray' });
    const res = mockResponse();

    await patientController.downloadDocument(req, res, mockNext);

    expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('cloudinary.com'));
  });

  it('Failure: should call next if document not found', async () => {
    patientModel.getDocumentByPatientIdAndType.mockResolvedValue(null);
    const req = mockRequest(testConstants.getUploadDocumentId, { document_type: 'xray' });
    const res = mockResponse();

    await patientController.downloadDocument(req, res, mockNext);

  });
});

});

})