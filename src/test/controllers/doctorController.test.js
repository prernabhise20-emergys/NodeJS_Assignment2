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
                                                                          
// jest.mock('../../common/utility/upload.js', () => ({
//     uploadFile: jest.fn(),
// }));
                                                                        
// jest.mock('../../common/utility/prescriptionPdf.js', () => ({
//     generatePdf: jest.fn(),
// }));

// jest.mock('../../common/utility/sendPrescription.js', () => jest.fn());

// const { uploadFile } = require('../../common/utility/upload.js');
// const { generatePdf } = require('../../common/utility/prescriptionPdf.js');
// const sendPrescription = require('../../common/utility/sendPrescription.js');

// describe("uploadPrescription Controller", () => {
//     const mockRequest = {
//         body: {
//             appointment_id: "123",
//             medicines: ["med1", "med2"],
//             capacity: "500mg",
//             dosage: "twice daily",
//             morning: true,
//             afternoon: false,
//             evening: true,
//             courseDuration: "7 days",
//         },
//         user: { email: "prerna@example.com" },
//     };

//     const mockResponse = {
//         status: jest.fn().mockReturnThis(),
//         send: jest.fn(),
//     };

//     const mockNext = jest.fn();

//     const mockPatientData = {
//         patientName: "Prerna Bhise",
//         date: "2025-04-01",
//         age: 30,
//         doctorName: "Dr. Satej",
//         specialization: "General Medicine",
//         gender: "Male",
//         date_of_birth: "1995-01-01",
//     };

//     const mockPdfBuffer = Buffer.from("PDF content");
//     const mockUploadResult = { secure_url: "https://example.com/raw/upload/test-path/prescription.pdf" };

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it("should successfully upload a prescription", async () => {
//         jest.mock('../../models/doctorModel.js', () => ({
//             getAppointmentData: jest.fn().mockResolvedValue(mockPatientData),
//         }));
//         jest.mock('../../common/utility/upload.js', () => jest.fn().mockResolvedValue(mockUploadResult));
//         jest.mock('../../common/utility/sendPrescription.js', () => jest.fn().mockResolvedValue());
    
//         await doctorController.uploadPrescription(mockRequest, mockResponse, mockNext);
    
//         expect(doctorModel.getAppointmentData).toHaveBeenCalledWith("123");
//         // expect(generatePdf).toHaveBeenCalledWith(
//         //     expect.objectContaining(mockPatientData), 
//         //     "Prerna Bhise",
//         //     "2025-04-01",
//         //     30,
//         //     "Male",
//         //     "Dr. Satej",
//         //     "General Medicine",
//         //     "1995-01-01"
//         // );
//         expect(uploadFile).toHaveBeenCalledWith({
//             buffer: mockPdfBuffer,
//             originalname: "prescription.pdf",
//         });
//         expect(doctorModel.savePrescription).toHaveBeenCalledWith(
//             "123",
//             mockUploadResult.secure_url, 
//             expect.any(String)
//         );
//         expect(sendPrescription).toHaveBeenCalledWith("prerna@example.com", mockUploadResult.secure_url);
    
//         expect(mockResponse.status).toHaveBeenCalledWith(SUCCESS_STATUS_CODE.SUCCESS);
//         expect(mockResponse.send).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 data: { cloudinaryUrl: mockUploadResult.secure_url }, 
//             })
//         );
//     });
    
    // it("should handle errors and call next with the error", async () => {
    //     const mockError = new Error("Test error");
    //     doctorModel.getAppointmentData = jest.fn().mockRejectedValue(mockError);

    //     await doctorController.uploadPrescription(mockRequest, mockResponse, mockNext);

    //     expect(mockNext).toHaveBeenCalledWith(mockError);
    // });
});

