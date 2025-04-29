const patientController=require('../../controllers/patientController.js')
const testConstants = require("../controllers/test.constants.js")
const patientModel = require('../../models/patientModel.js'); 
const { ResponseHandler,MessageHandler } = require('../../common/utility/handlers'); 
const { SUCCESS_STATUS_CODE, SUCCESS_MESSAGE,ERROR_STATUS_CODE,ERROR_MESSAGE } = require('../../common/constants/statusConstant');
const jwt = require('jsonwebtoken');

jest.mock('../../models/patientModel.js'); 

jest.mock("../../common/utility/handlers", () => ({
  ResponseHandler: jest.fn(),
  MessageHandler: jest.fn(),
}))


describe('Patient Controller Test Cases',()=>{
    
describe('showPatientDetails Controller', () => {
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

  it('should return patient details successfully', async () => {
    const mockUserId = '123';
    const mockPatientInfo = { name: 'John Doe', age: 30 };
    getPatientInfo.mockResolvedValue(mockPatientInfo);

    const req = mockRequest(mockUserId);
    const res = mockResponse();

    await showPatientDetails(req, res, mockNext);

    expect(getPatientInfo).toHaveBeenCalledWith(mockUserId);
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

  it('should call next with error when an exception occurs', async () => {
    const mockUserId = '123';
    const mockError = new Error('Something went wrong');
    getPatientInfo.mockRejectedValue(mockError);

    const req = mockRequest(mockUserId);
    const res = mockResponse();

    await showPatientDetails(req, res, mockNext);

    expect(getPatientInfo).toHaveBeenCalledWith(mockUserId);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});



// jest.mock('./path/to/service', () => ({
//   getPersonalInfo: jest.fn(),
// }));

// describe('getPersonalDetails Controller', () => {
//   const mockRequest = (patient_id) => ({
//     params: { patient_id },
//   });

//   const mockResponse = () => {
//     const res = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const mockNext = jest.fn();

//   it('should return personal details successfully', async () => {
//     const mockPatientId = '456';
//     const mockFamilyInfo = { familyName: 'Smith', members: 4 };
//     getPersonalInfo.mockResolvedValue(mockFamilyInfo);

//     const req = mockRequest(mockPatientId);
//     const res = mockResponse();

//     await getPersonalDetails(req, res, mockNext);

//     expect(getPersonalInfo).toHaveBeenCalledWith(mockPatientId);
//     expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
//     expect(res.send).toHaveBeenCalledWith(
//       new ResponseHandler(
//         SUCCESS_STATUS_CODE.SUCCESS,
//         SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
//         mockFamilyInfo
//       )
//     );
//     expect(mockNext).not.toHaveBeenCalled();
//   });

//   it('should call next with error when an exception occurs', async () => {
//     const mockPatientId = '456';
//     const mockError = new Error('Database connection error');
//     getPersonalInfo.mockRejectedValue(mockError);

//     const req = mockRequest(mockPatientId);
//     const res = mockResponse();

//     await getPersonalDetails(req, res, mockNext);

//     expect(getPersonalInfo).toHaveBeenCalledWith(mockPatientId);
//     expect(mockNext).toHaveBeenCalledWith(mockError);
//   });


// jest.mock('./path/to/service', () => ({
//   createPersonalDetails: jest.fn(),
// }));

// describe('createPersonalInfo Controller', () => {
//   const mockRequest = (body, id, email) => ({
//     body,
//     user: { userid: id, email },
//   });

//   const mockResponse = () => {
//     const res = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const mockNext = jest.fn();

//   it('should create personal details successfully', async () => {
//     const mockBody = {
//       patient_name: 'Jane Doe',
//       date_of_birth: '2000-01-01',
//       gender: 'Female',
//       weight: 65,
//       height: 170,
//       country_of_origin: 'India',
//       is_diabetic: false,
//       cardiac_issue: false,
//       blood_pressure: 'Normal',
//     };

//     const mockUserId = '123';
//     const mockEmail = 'jane.doe@example.com';
//     const mockResult = { insertId: 789 };

//     createPersonalDetails.mockResolvedValue(mockResult);

//     const req = mockRequest(mockBody, mockUserId, mockEmail);
//     const res = mockResponse();

//     await createPersonalInfo(req, res, mockNext);

//     expect(createPersonalDetails).toHaveBeenCalledWith(mockBody, mockUserId, mockEmail);
//     expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.CREATED);
//     expect(res.send).toHaveBeenCalledWith(
//       new ResponseHandler(
//         SUCCESS_STATUS_CODE.CREATED,
//         SUCCESS_MESSAGE.ADDED_PERSONAL_INFO_MESSAGE,
//         { patient_id: mockResult.insertId }
//       )
//     );
//     expect(mockNext).not.toHaveBeenCalled();
//   });

//   it('should call next with error when an exception occurs', async () => {
//     const mockBody = {
//       patient_name: 'Jane Doe',
//       date_of_birth: '2000-01-01',
//       gender: 'Female',
//       weight: 65,
//       height: 170,
//       country_of_origin: 'India',
//       is_diabetic: false,
//       cardiac_issue: false,
//       blood_pressure: 'Normal',
//     };

//     const mockUserId = '123';
//     const mockEmail = 'jane.doe@example.com';
//     const mockError = new Error('Database error');

//     createPersonalDetails.mockRejectedValue(mockError);

//     const req = mockRequest(mockBody, mockUserId, mockEmail);
//     const res = mockResponse();

//     await createPersonalInfo(req, res, mockNext);

//     expect(createPersonalDetails).toHaveBeenCalledWith(mockBody, mockUserId, mockEmail);
//     expect(mockNext).toHaveBeenCalledWith(mockError);
//   });
// });


// jest.mock('./path/to/service', () => ({
//   updatePersonalDetails: jest.fn(),
//   checkUserWithPatientID: jest.fn(),
// }));

// describe('updatePersonalInfo Controller', () => {
//   const mockRequest = (body, userid, is_admin) => ({
//     body,
//     user: { userid, admin: is_admin },
//   });

//   const mockResponse = () => {
//     const res = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const mockNext = jest.fn();

//   it('should update personal info successfully for valid patient or admin', async () => {
//     const mockBody = {
//       patient_name: 'John Doe',
//       date_of_birth: '1990-01-01',
//       gender: 'Male',
//       weight: 70,
//       height: 180,
//       country_of_origin: 'India',
//       is_diabetic: true,
//       cardiac_issue: false,
//       blood_pressure: true,
//       patient_id: '789',
//     };

//     const mockUserId = '123';
//     const mockIsAdmin = true;

//     checkUserWithPatientID.mockResolvedValue(true); // Simulate valid patient
//     updatePersonalDetails.mockResolvedValue();

//     const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
//     const res = mockResponse();

//     await updatePersonalInfo(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
//     expect(updatePersonalDetails).toHaveBeenCalledWith(expect.objectContaining({
//       patient_name: 'John Doe',
//       date_of_birth: '1990-01-01',
//     }), mockBody.patient_id);
//     expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
//     expect(res.send).toHaveBeenCalledWith(
//       new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.UPDATE_INFO_SUCCESS_MESSAGE)
//     );
//     expect(mockNext).not.toHaveBeenCalled();
//   });

//   it('should throw UNAUTHORIZED_ACCESS if patient is invalid and user is not admin', async () => {
//     const mockBody = {
//       patient_name: 'John Doe',
//       date_of_birth: '1990-01-01',
//       gender: 'Male',
//       weight: 70,
//       height: 180,
//       country_of_origin: 'India',
//       is_diabetic: true,
//       cardiac_issue: false,
//       blood_pressure: true,
//       patient_id: '789',
//     };

//     const mockUserId = '123';
//     const mockIsAdmin = false;

//     checkUserWithPatientID.mockResolvedValue(false); // Simulate invalid patient
//     const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
//     const res = mockResponse();

//     await updatePersonalInfo(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
//     expect(mockNext).toHaveBeenCalledWith(UNAUTHORIZED_ACCESS);
//   });

//   it('should call next with error when an exception occurs', async () => {
//     const mockBody = {
//       patient_name: 'John Doe',
//       date_of_birth: '1990-01-01',
//       gender: 'Male',
//       weight: 70,
//       height: 180,
//       country_of_origin: 'India',
//       is_diabetic: true,
//       cardiac_issue: false,
//       blood_pressure: true,
//       patient_id: '789',
//     };

//     const mockUserId = '123';
//     const mockIsAdmin = true;
//     const mockError = new Error('Database error');

//     checkUserWithPatientID.mockRejectedValue(mockError);

//     const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
//     const res = mockResponse();

//     await updatePersonalInfo(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
//     expect(mockNext).toHaveBeenCalledWith(mockError);
//   });
// });


// jest.mock('./path/to/service', () => ({
//   deletePersonalDetails: jest.fn(),
//   checkUserWithPatientID: jest.fn(),
// }));

// describe('deletePersonalInfo Controller', () => {
//   const mockRequest = (userid, is_admin, patient_id) => ({
//     user: { userid, admin: is_admin },
//     params: { patient_id },
//   });

//   const mockResponse = () => {
//     const res = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const mockNext = jest.fn();

//   it('should delete personal info successfully for valid patient or admin', async () => {
//     const mockUserId = '123';
//     const mockIsAdmin = true;
//     const mockPatientId = '789';

//     checkUserWithPatientID.mockResolvedValue(true); // Simulate valid patient
//     deletePersonalDetails.mockResolvedValue();

//     const req = mockRequest(mockUserId, mockIsAdmin, mockPatientId);
//     const res = mockResponse();

//     await deletePersonalInfo(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
//     expect(deletePersonalDetails).toHaveBeenCalledWith(mockPatientId);
//     expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
//     expect(res.send).toHaveBeenCalledWith(
//       new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE)
//     );
//     expect(mockNext).not.toHaveBeenCalled();
//   });

//   it('should throw NOT_DELETED error if patient is invalid and user is not admin', async () => {
//     const mockUserId = '123';
//     const mockIsAdmin = false;
//     const mockPatientId = '789';

//     checkUserWithPatientID.mockResolvedValue(false); // Simulate invalid patient

//     const req = mockRequest(mockUserId, mockIsAdmin, mockPatientId);
//     const res = mockResponse();

//     await deletePersonalInfo(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
//     expect(mockNext).toHaveBeenCalledWith(NOT_DELETED);
//   });

//   it('should call next with error when an exception occurs', async () => {
//     const mockUserId = '123';
//     const mockIsAdmin = true;
//     const mockPatientId = '789';
//     const mockError = new Error('Database error');

//     checkUserWithPatientID.mockRejectedValue(mockError);

//     const req = mockRequest(mockUserId, mockIsAdmin, mockPatientId);
//     const res = mockResponse();

//     await deletePersonalInfo(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
//     expect(mockNext).toHaveBeenCalledWith(mockError);
//   });
// });



// jest.mock('./path/to/service', () => ({
//   getFamilyInfo: jest.fn(),
// }));

// describe('getFamilyDetails Controller', () => {
//   const mockRequest = (patient_id) => ({
//     params: { patient_id },
//   });

//   const mockResponse = () => {
//     const res = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const mockNext = jest.fn();

//   it('should retrieve family details successfully', async () => {
//     const mockPatientId = '123';
//     const mockFamilyInfo = { familyName: 'Doe', members: ['John', 'Jane', 'Jim'] };

//     getFamilyInfo.mockResolvedValue(mockFamilyInfo);

//     const req = mockRequest(mockPatientId);
//     const res = mockResponse();

//     await getFamilyDetails(req, res, mockNext);

//     expect(getFamilyInfo).toHaveBeenCalledWith(mockPatientId);
//     expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
//     expect(res.send).toHaveBeenCalledWith(
//       new ResponseHandler(
//         SUCCESS_STATUS_CODE.SUCCESS,
//         SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
//         mockFamilyInfo
//       )
//     );
//     expect(mockNext).not.toHaveBeenCalled();
//   });

//   it('should call next with error when an exception occurs', async () => {
//     const mockPatientId = '123';
//     const mockError = new Error('Database error');

//     getFamilyInfo.mockRejectedValue(mockError);

//     const req = mockRequest(mockPatientId);
//     const res = mockResponse();

//     await getFamilyDetails(req, res, mockNext);

//     expect(getFamilyInfo).toHaveBeenCalledWith(mockPatientId);
//     expect(mockNext).toHaveBeenCalledWith(mockError);
//   });
// });

// jest.mock('./path/to/service', () => ({
//   insertFamilyInfo: jest.fn(),
// }));

// describe('addFamilyInfo Controller', () => {
//   const mockRequest = (familyDetails) => ({
//     body: { familyDetails },
//   });

//   const mockResponse = () => {
//     const res = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const mockNext = jest.fn();

//   it('should add family info successfully', async () => {
//     const mockFamilyDetails = { familyName: 'Doe', members: ['John', 'Jane', 'Jim'] };
//     insertFamilyInfo.mockResolvedValue(); // Simulate successful addition

//     const req = mockRequest(mockFamilyDetails);
//     const res = mockResponse();

//     await addFamilyInfo(req, res, mockNext);

//     expect(insertFamilyInfo).toHaveBeenCalledWith(mockFamilyDetails);
//     expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
//     expect(res.send).toHaveBeenCalledWith(
//       new ResponseHandler(
//         SUCCESS_STATUS_CODE.SUCCESS,
//         SUCCESS_MESSAGE.ADDED_FAMILY_MESSAGE
//       )
//     );
//     expect(mockNext).not.toHaveBeenCalled();
//   });

//   it('should call next with error when an exception occurs', async () => {
//     const mockFamilyDetails = { familyName: 'Doe', members: ['John', 'Jane', 'Jim'] };
//     const mockError = new Error('Database error');

//     insertFamilyInfo.mockRejectedValue(mockError); // Simulate an error

//     const req = mockRequest(mockFamilyDetails);
//     const res = mockResponse();

//     await addFamilyInfo(req, res, mockNext);

//     expect(insertFamilyInfo).toHaveBeenCalledWith(mockFamilyDetails);
//     expect(mockNext).toHaveBeenCalledWith(mockError);
//   });
// });


// jest.mock('./path/to/service', () => ({
//   updateFamilyInfo: jest.fn(),
//   checkUserWithPatientID: jest.fn(),
// }));

// describe('updateFamilyInfoDetails Controller', () => {
//   const mockRequest = (body, userid, is_admin) => ({
//     body,
//     user: { userid, admin: is_admin },
//   });

//   const mockResponse = () => {
//     const res = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const mockNext = jest.fn();

//   it('should update family info successfully for valid patient or admin', async () => {
//     const mockBody = {
//       father_name: 'John Doe',
//       father_age: 50,
//       father_country_origin: 'India',
//       mother_name: 'Jane Doe',
//       mother_age: 48,
//       mother_country_origin: 'India',
//       mother_diabetic: true,
//       mother_cardiac_issue: false,
//       mother_bp: false,
//       father_diabetic: false,
//       father_cardiac_issue: true,
//       father_bp: true,
//       patient_id: '789',
//     };

//     const mockUserId = '123';
//     const mockIsAdmin = true;

//     checkUserWithPatientID.mockResolvedValue(true); // Simulate valid patient
//     updateFamilyInfo.mockResolvedValue();

//     const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
//     const res = mockResponse();

//     await updateFamilyInfoDetails(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
//     expect(updateFamilyInfo).toHaveBeenCalledWith(expect.objectContaining({
//       father_name: 'John Doe',
//       mother_name: 'Jane Doe',
//     }), mockBody.patient_id);
//     expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
//     expect(res.send).toHaveBeenCalledWith(
//       new ResponseHandler(
//         SUCCESS_STATUS_CODE.SUCCESS,
//         SUCCESS_MESSAGE.FAMILY_UPDATE_SUCCESSFULLY
//       )
//     );
//     expect(mockNext).not.toHaveBeenCalled();
//   });

//   it('should throw NOT_UPDATE error if patient is invalid and user is not admin', async () => {
//     const mockBody = {
//       father_name: 'John Doe',
//       father_age: 50,
//       father_country_origin: 'India',
//       mother_name: 'Jane Doe',
//       mother_age: 48,
//       mother_country_origin: 'India',
//       mother_diabetic: true,
//       mother_cardiac_issue: false,
//       mother_bp: false,
//       father_diabetic: false,
//       father_cardiac_issue: true,
//       father_bp: true,
//       patient_id: '789',
//     };

//     const mockUserId = '123';
//     const mockIsAdmin = false;

//     checkUserWithPatientID.mockResolvedValue(false); // Simulate invalid patient

//     const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
//     const res = mockResponse();

//     await updateFamilyInfoDetails(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
//     expect(mockNext).toHaveBeenCalledWith(NOT_UPDATE);
//   });

//   it('should call next with error when an exception occurs', async () => {
//     const mockBody = {
//       father_name: 'John Doe',
//       father_age: 50,
//       father_country_origin: 'India',
//       mother_name: 'Jane Doe',
//       mother_age: 48,
//       mother_country_origin: 'India',
//       mother_diabetic: true,
//       mother_cardiac_issue: false,
//       mother_bp: false,
//       father_diabetic: false,
//       father_cardiac_issue: true,
//       father_bp: true,
//       patient_id: '789',
//     };

//     const mockUserId = '123';
//     const mockIsAdmin = true;
//     const mockError = new Error('Database error');

//     checkUserWithPatientID.mockRejectedValue(mockError);

//     const req = mockRequest(mockBody, mockUserId, mockIsAdmin);
//     const res = mockResponse();

//     await updateFamilyInfoDetails(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockBody.patient_id);
//     expect(mockNext).toHaveBeenCalledWith(mockError);
//   });
// });


// jest.mock('./path/to/service', () => ({
//   deleteFamilyInfo: jest.fn(),
//   checkUserWithPatientID: jest.fn(),
// }));

// describe('deleteFamilyInfoDetails Controller', () => {
//   const mockRequest = (patient_id, userid, is_admin) => ({
//     params: { patient_id },
//     user: { userid, admin: is_admin },
//   });

//   const mockResponse = () => {
//     const res = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const mockNext = jest.fn();

//   it('should delete family info successfully for valid patient or admin', async () => {
//     const mockPatientId = '789';
//     const mockUserId = '123';
//     const mockIsAdmin = true;

//     checkUserWithPatientID.mockResolvedValue(true); // Simulate valid patient
//     deleteFamilyInfo.mockResolvedValue(); // Simulate successful deletion

//     const req = mockRequest(mockPatientId, mockUserId, mockIsAdmin);
//     const res = mockResponse();

//     await deleteFamilyInfoDetails(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
//     expect(deleteFamilyInfo).toHaveBeenCalledWith(mockPatientId);
//     expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
//     expect(res.send).toHaveBeenCalledWith(
//       new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.FAMILY_DELETE_SUCCESSFULLY)
//     );
//     expect(mockNext).not.toHaveBeenCalled();
//   });

//   it('should throw NOT_DELETED error if patient is invalid and user is not admin', async () => {
//     const mockPatientId = '789';
//     const mockUserId = '123';
//     const mockIsAdmin = false;

//     checkUserWithPatientID.mockResolvedValue(false); // Simulate invalid patient

//     const req = mockRequest(mockPatientId, mockUserId, mockIsAdmin);
//     const res = mockResponse();

//     await deleteFamilyInfoDetails(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
//     expect(mockNext).toHaveBeenCalledWith(NOT_DELETED);
//   });

//   it('should call next with error when an exception occurs', async () => {
//     const mockPatientId = '789';
//     const mockUserId = '123';
//     const mockIsAdmin = true;
//     const mockError = new Error('Database error');

//     checkUserWithPatientID.mockRejectedValue(mockError); // Simulate exception

//     const req = mockRequest(mockPatientId, mockUserId, mockIsAdmin);
//     const res = mockResponse();

//     await deleteFamilyInfoDetails(req, res, mockNext);

//     expect(checkUserWithPatientID).toHaveBeenCalledWith(mockUserId, mockPatientId);
//     expect(mockNext).toHaveBeenCalledWith(mockError);
//   });
// });


// jest.mock('./path/to/service', () => ({
//   getDiseaseInfo: jest.fn(),
// }));

// describe('getDiseaseDetails Controller', () => {
//   const mockRequest = (patient_id) => ({
//     params: { patient_id },
//   });

//   const mockResponse = () => {
//     const res = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.send = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const mockNext = jest.fn();

//   it('should retrieve disease details successfully', async () => {
//     const mockPatientId = '123';
//     const mockDiseaseDetails = { diseaseName: 'Diabetes', severity: 'Moderate' };

//     getDiseaseInfo.mockResolvedValue(mockDiseaseDetails);

//     const req = mockRequest(mockPatientId);
//     const res = mockResponse();

//     await getDiseaseDetails(req, res, mockNext);

//     expect(getDiseaseInfo).toHaveBeenCalledWith(mockPatientId);
//     expect(res.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
//     expect(res.send).toHaveBeenCalledWith(
//       new ResponseHandler(
//         SUCCESS_STATUS_CODE.SUCCESS,
//         SUCCESS_MESSAGE.DISEASE_DETAILS,
//         mockDiseaseDetails
//       )
//     );
//     expect(mockNext).not.toHaveBeenCalled();
//   });

//   it('should call next with error when an exception occurs', async () => {
//     const mockPatientId = '123';
//     const mockError = new Error('Database error');

//     getDiseaseInfo.mockRejectedValue(mockError);

//     const req = mockRequest(mockPatientId);
//     const res = mockResponse();

//     await getDiseaseDetails(req, res, mockNext);

//     expect(getDiseaseInfo).toHaveBeenCalledWith(mockPatientId);
//     expect(mockNext).toHaveBeenCalledWith(mockError);
//   });
// });


// });

})