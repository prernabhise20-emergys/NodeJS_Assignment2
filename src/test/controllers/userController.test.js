// const request = require('express');
// const userModel = require('../../models/userModel.js'); // Import the model method you're mocking
// const { register } = require('../../controllers/userController.js'); // Import your controller
// require('dotenv').config();
// const responseHandler=require("../../common/utility/handlers.js");

// jest.mock("../../common/utility/handlers.js",()=>{
//     ResponseHandler=jest.fn(),
//     MessageHandler=jest.fn()
// })
// jest.mock('../../models/userModel.js');

// describe('POST /register', () => {
//     let req, res, next;
  
//     beforeEach(() => {
//       req = {
//         body: {
//           email: "prera@gmail.com",
//           user_password: '123456',
//           first_name: 'Prerna',
//           last_name: 'Bhise',
//           mobile_number: '1234567867',
//           userCode: "DR223"
//         }
//       };
  
//       res = {
//         status: jest.fn().mockReturnThis(),
//         send: jest.fn()
//       };
  
//       next = jest.fn();
//     });
  
//     it('should create a new user', async () => {
//       userModel.createUserData.mockResolvedValue({
//         status: 200,
//         message: "User registered successfully. Verification email sent.",
//         error: null
//       });
  
//     responseHandler(200, "User registered successfully. Verification email sent")
//       await register(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.send).toHaveBeenCalledWith(responseHandler);
  
//       expect(next).not.toHaveBeenCalled();
//     });
  
//     // it('should return error if user already exists', async () => {
//     //   // Mock the behavior of checkIfUserExists to simulate the case where user already exists
//     //   const USER_EXISTS = { message: "User already exists" }; // Define error message
//     //   userModel.checkIfUserExists.mockResolvedValue(true); // Simulate that the user exists
  
//     //   await register(req, res, next);
  
//     //   // Check if next was called with the error message
//     //   expect(next).toHaveBeenCalledWith(USER_EXISTS);
//     // });
//   });
  
// const {AUTH_RESPONSES}=require("../../common/constants/response.js")
// const {SUCCESS_STATUS_CODE,
//     SUCCESS_MESSAGE,
//     ERROR_STATUS_CODE,
//     ERROR_MESSAGE}  =require("../../common/constants/statusConstant.js")
// const request = require('express');
// const userModel = require('../../models/userModel.js'); // Import the model method you're mocking
// const { register } = require('../../controllers/userController.js'); // Import your controller
// require('dotenv').config();
// const {responseHandler,messageHandler}=require("../../common/utility/handlers.js");

// jest.mock("../../common/utility/handlers.js",()=>{
//     responseHandler=jest.fn(),
//     messageHandler=jest.fn()
// })
// jest.mock('../../models/userModel.js');

// describe('POST /register', () => {
//     let req, res, next;
  
//     beforeEach(() => {
//       req = {
//         body: {
//           email: "prera@gmail.com",
//           user_password: '123456',
//           first_name: 'Prerna',
//           last_name: 'Bhise',
//           mobile_number: '1234567867',
//           userCode: "DR223"
//         }
//       };
  
//       res = {
//         status: jest.fn().mockReturnThis(),
//         send: jest.fn()
//       };
  
//       next = jest.fn();
//     });
  
//     it('should create a new user', async () => {
//       userModel.createUserData.mockResolvedValue({
//         status: 200,
//         message: "User registered successfully. Verification email sent.",
//         error: null
//       });
  
//     responseHandler(200, "User registered successfully. Verification email sent")
//       await register(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.send).toHaveBeenCalledWith(responseHandler);
  
//       expect(next).not.toHaveBeenCalled();
//     });
  
//     // it('should return error if user already exists', async () => {
//     //   // Mock the behavior of checkIfUserExists to simulate the case where user already exists
//     //   const USER_EXISTS = { message: "User already exists" }; // Define error message
//     //   userModel.checkIfUserExists.mockResolvedValue(true); // Simulate that the user exists
  
//     //   await register(req, res, next);
  
//     //   // Check if next was called with the error message
//     //   expect(next).toHaveBeenCalledWith(USER_EXISTS);
//     // });
//   });
  


const request = require('express');
const userModel = require('../../models/userModel.js'); // Import the model method you're mocking
const { register } = require('../../controllers/userController.js'); // Import your controller
require('dotenv').config();
const { ResponseHandler} = require("../../common/utility/handlers.js");

jest.mock("../../common/utility/handlers.js", () => ({
  ResponseHandler: jest.fn(),
  MessageHandler: jest.fn(),
}));

jest.mock('../../models/userModel.js');

describe('POST /register', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "prera@gmail.com",
        user_password: '123456',
        first_name: 'Prerna',
        last_name: 'Bhise',
        mobile_number: '1234567867',
      
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  it('should create a new user', async () => {
    userModel.createUserData.mockResolvedValue({
      status: 200,
      message: "User registered successfully. Verification email sent.",
      error: null,
    });

    const mockResponse = new ResponseHandler(200, "User registered successfully. Verification email sent.");

    await register(req, res, next);

    expect(ResponseHandler).toHaveBeenCalledWith(200, "User registered successfully. Verification email sent.");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.send).toHaveBeenCalledWith(mockResponse);

    expect(next).not.toHaveBeenCalled();
  });

  // it('should return error if user already exists', async () => {
  //   // Mock the behavior of checkIfUserExists to simulate the case where user already exists
  //   const USER_EXISTS = { message: "User already exists" }; // Define error message
  //   userModel.checkIfUserExists.mockResolvedValue(true); // Simulate that the user exists

  //   await register(req, res, next);

  //   // Check if next was called with the error message
  //   expect(next).toHaveBeenCalledWith(USER_EXISTS);
  // });
});