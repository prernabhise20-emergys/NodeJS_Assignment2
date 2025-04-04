import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendVerificationEmail from "../common/utility/sendVerificationEmail.js";
import { ResponseHandler } from "../common/utility/handlers.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import sendOtpToEmail from "../common/utility/otpMail.js";

import {
  createDoctorAppointment,
  isDoctorAvailable,
  checkDoctorAvailability,
  getDoctorInfo,
  DoctorLogin,
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
    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_MESSAGE.REGISTER_SUCCESS));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, user_password } = req.body;
    const check1 = await checkUserDeleteOrNot(email);
    if (check1) {
      throw USER_DELETED;
    }
    await DoctorLogin(email)

    const user = await loginUser(email);

    if (!user) {
      throw INVALID_USER;
    }

    const match = await bcrypt.compare(user_password, user.user_password);

    if (!match) {
      throw INVALID_USER;
    }

    const token = jwt.sign(
      {
        userid: user.id,
        email: user.email,
        user_password: user.user_password,
        admin: user.is_admin,
        doctor: user.is_doctor
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );

    if (user.is_admin) {
      res.json({
        message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
        admin_message: user.is_admin,
        token,
      });
    }
    else
      if (user.is_doctor) {
        res.json({
          message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
          doctor_message: user.is_doctor,
          token,
        });
      }
      else {
        res.json({
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
            SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
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
      const first_name = await getName(email)

      await sendOtpToEmail(email,name, otp);

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
const {email}=req.user;
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
  const { doctor_id, date } = req.query;

  try {
    const availableTime = await checkDoctorAvailability(doctor_id, date);
    const startTime = new Date(availableTime[0]).toLocaleTimeString();
    const endTime = new Date(availableTime[1]).toLocaleTimeString();


    res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_MESSAGE.AVAILABLE_SLOT, { startTime: startTime, endTime: endTime })
    );

  } catch (error) {
    next(error);
  }
};
export default {
  createAppointment,
  getDoctorAvailability,
  getDoctors,
  forgotPassword,
  resetPassword,
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
};
