import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendVerificationEmail from "../common/utility/sendVerificationEmail.js";
import { ResponseHandler } from "../common/utility/handlers.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import sendOtpToEmail from "../common/utility/otpMail.js";
import { Buffer } from "buffer";
import {
  checkDoctorAvailability,
  checkDoctor,
  doctorFlag,
  createDoctorAppointment,
  isDoctorAvailable,
  getDoctorInfo,
  getName,
  checkEmailExists,
  checkAlreadyExist,
  getDeleteUserInfo,
  createUserData,
  checkIfUserExists,
  loginUser,
  getUserData,
  updateUserData,
  deleteUserData,
  checkUserDeleteOrNot,
  checkAdminCount,
  updatePassword,
} from "../models/userModel.js";
import {
  SUCCESS_STATUS_CODE,
  SUCCESS_MESSAGE,
  ERROR_STATUS_CODE,
  ERROR_MESSAGE
} from "../common/constants/statusConstant.js";

dotenv.config();
const { USER_DELETED, USER_EXISTS, INVALID_USER, CANNOT_DELETE_USER } =
  AUTH_RESPONSES;

const register = async (req, res, next) => {
  try {
    const { email, user_password, first_name, last_name, mobile_number } =
      req.body;

    const userExists = await checkIfUserExists(email);
    if (userExists) {
      throw USER_EXISTS;
    }


    await createUserData(
      email,
      user_password,
      first_name,
      last_name,
      mobile_number
    );

    await sendVerificationEmail(email);

    const result = await checkDoctor(email);
    if (result) {
      await doctorFlag(email);

    }

    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_MESSAGE.REGISTER_SUCCESS));
  } catch (error) {
    next(error);
  }
};


// const login = async (req, res, next) => {

//   try {
//     const { email, user_password } = req.body;
// // console.log(user_password);

//     const check1 = await checkUserDeleteOrNot(email);

//     if (check1) {
//       throw USER_DELETED;
//     }

//     const user = await loginUser(email);

//     if (!user) {
//       throw INVALID_USER;
//     }
// console.log('user',user.user_password);

//     const passwordMatch = await bcrypt.compare(user_password,user.user_password);
// console.log(passwordMatch)
//     if (!passwordMatch) {
//       throw INVALID_USER;
//     }
//     // console.log('id', user.id);

//     const token = jwt.sign(
//       {
//         userid: user.id,
//         email: user.email,
//         user_password: user.user_password,
//         admin: user.is_admin,
//         doctor: user.is_doctor
//       },
//       process.env.SECRET_KEY,
//       {
//         expiresIn: "3h",
//         algorithm: 'HS256'
//       }
//     );

//     if (user.is_admin) {
//     return res.status(200).send({
//         message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
//         admin_message: user.is_admin,
//         token,
//       });
//     }

//     if (user.is_doctor) {
//       return res.status(200).send({
//         message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
//         doctor_message: user.is_doctor,
//         token,
//       });
//     }
//     else {
//       return res.status(200).send({
//         message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
//         token,
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };


const login = async (req, res, next) => {
  try {
    const { email, user_password } = req.body;

    const isDeleted = await checkUserDeleteOrNot(email);
    if (isDeleted) {
      throw USER_DELETED;
    }

    const user = await loginUser(email);
    if (!user) {
      throw INVALID_USER;
    }

    const passwordMatch = await bcrypt.compare(user_password, user.user_password);
    console.log('passwordMatch', passwordMatch);

    if (!passwordMatch) {
      throw INVALID_USER;
    }

    const token = jwt.sign(
      {
        userid: user.id,
        email: user.email,
        admin: user.is_admin,
        doctor: user.is_doctor,
        first_name:user.first_name,
        last_name:user.last_name,
        mobile_number:user.mobile_number
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h", algorithm: "HS256" }
    );

   
    if (user.is_admin) {
    return res.status(200).send({
        message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
        admin_message: user.is_admin,
        token,
      });
    }

    if (user.is_doctor) {
      return res.status(200).send({
        message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
        doctor_message: user.is_doctor,
        token,
      });
    }
    else {
      return res.status(200).send({
        message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
        token,
      });
    }
  } catch (error) {
    next(error);
  }
};


const updateUser = async (req, res, next) => {
  try {
    const {
      body: { first_name, last_name, mobile_number },
    } = req;
    const { userid: id } = req.user;

    const formData = {
      first_name,
      last_name,
      mobile_number,
    };

    await updateUserData(formData, id);
    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_MESSAGE.USER_UPDATE_SUCCESS_MSG));
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userid: id, admin } = req.user;

    if (admin) {
      const adminCount = await checkAdminCount();

      if (adminCount <= 1) {
        throw CANNOT_DELETE_USER;
      }
    }

    await deleteUserData(id);
    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE));
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userid: id, email: emailID } = req.user;
    const checkExists = await checkAlreadyExist(emailID);
    console.log("req.user:", req.user);

    if (checkExists) {
      const deletedUserInfo = await getDeleteUserInfo(emailID);
      if (deletedUserInfo) {
        res
          .status(SUCCESS_STATUS_CODE.SUCCESS)
          .send(
            new ResponseHandler(
              SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
              deletedUserInfo
            )
          );
      }
    } else {
      const user = await getUserData(id);
      res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(
          new ResponseHandler(
            SUCCESS_MESSAGE.USER_INFO_SUCCESS_MESSAGE,
            user
          )
        );
    }
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const validEmail = await checkEmailExists(email);

    if (validEmail) {
      const name = await getName(email)

      await sendOtpToEmail(email, name, otp);

      const hashOtp = await bcrypt.hash(otp, 10);

      res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_MESSAGE.OTP_SENT, { hashOtp }));
    }
    res
      .status(ERROR_STATUS_CODE.BAD_REQUEST)
      .send(new ResponseHandler(ERROR_MESSAGE.EMAIL_NOT_EXISTS));
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    await updatePassword(email, newPassword);
    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_MESSAGE.PASSWORD_UPDATE));
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {

    const personalInfo = await getDoctorInfo();
    res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE, personalInfo)
    );
  } catch (error) {
    next(error)
  }
};


const createAppointment = async (req, res, next) => {
  const { patient_id, doctor_id, date, time } = req.body;
  const { email } = req.user;
  try {
    const isAvailable = await isDoctorAvailable(doctor_id, date, time);

    if (!isAvailable) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_MESSAGE.BOOK_SLOT)
      );

    }

    const result = await createDoctorAppointment(patient_id, doctor_id, date, time);
    res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_MESSAGE.APPOINTMENT_BOOKED, { appointment_id: result.insertId })
    );

  } catch (error) {
    next(error);
  }
};
const getDoctorAvailability = async (req, res, next) => {
  try {
    const { doctor_id } = req.query;
    const { date } = req.body;

    const availableTimes = await checkDoctorAvailability(doctor_id, date);

    if (!availableTimes || availableTimes.length === 0) {
      return res.status(ERROR_STATUS_CODE.NOT_FOUND).send(
        new ResponseHandler(ERROR_MESSAGE.DOCTOR_NOT_AVAILABLE)
      );
    }

    const doctorInTime = availableTimes[0]?.doctorInTime || 'Not Available';
    const doctorOutTime = availableTimes[0]?.doctorOutTime || 'Not Available';

    const timeSlot = availableTimes
      .filter(row => row.appointment_time !== null) 
      .map(row => row.appointment_time); 

    res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_MESSAGE.AVAILABLE_SLOT, {
        doctorInTime,
        doctorOutTime,
        timeSlot,
      })
    );
  } catch (error) {
    next(error); 
  }
};



export default {
  getDoctorAvailability,
  createAppointment,
  getDoctors,
  forgotPassword,
  resetPassword,
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
};
