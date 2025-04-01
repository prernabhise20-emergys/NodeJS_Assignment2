import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendVerificationEmail from "../common/utility/sendVerificationEmail.js";
// import otpService from '../common/utility/otpService.js'
import { ResponseHandler } from "../common/utility/handlers.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import sendOtpToEmail from "../common/utility/otpMail.js";

import {
  checkAlreadyExist,
  getDeleteUserInfo,
  createUserData,
  checkIfUserExists,
  loginUser,
  getUserData,
  updateUserData,
  deleteUserData,
  checkUserDeleteOrNot,
  updatePassword,
} from "../models/userModel.js";
import {
  ERROR_STATUS_CODE,
  SUCCESS_STATUS_CODE,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from "../common/constants/statusConstant.js";

dotenv.config();
const { USER_EXISTS, INVALID_USER, USER_DELETED } = AUTH_RESPONSES;

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
    console.log(email);

    const check = await checkUserDeleteOrNot(email);
    if (!check) {
      throw USER_DELETED;
    }

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
    } else {
      res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(
          new ResponseHandler(SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE, token)
        );
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

const deleteUser = async (req, res, next) => {
  try {
    const { userid: id } = req.user;

    await deleteUserData(id);

    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE));
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);

    await sendOtpToEmail(email, otp);

    const hashOtp = await bcrypt.hash(otp, 10);

    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_MESSAGE.OTP_SENT, { hashOtp }));
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    console.log(email, newPassword);

    const updated = await updatePassword(newPassword, email);

    if (updated) {
      res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_MESSAGE.PASSWORD_UPDATED));
    } else {
      res
        .status(500)
        .send(new ResponseHandler(ERROR_MESSAGE.PASSWORD_UPDATE_FAILED));
    }
  } catch (error) {
    next(error);
  }
};

export default {
  forgotPassword,
  resetPassword,
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
};

// Math.random(): This function generates a random floating-point number between 0 (inclusive) and 1 (exclusive).

// Math.random() * 900000: This scales the random number to a range between 0 and 900,000.

// 100000 + Math.random() * 900000: This shifts the range to between 100,000 and 999,999. Essentially, it ensures that the random number is always a 6-digit number.

// Math.floor(100000 + Math.random() * 900000): The Math.floor() function rounds down the number to the nearest integer, ensuring you get a whole number between 100,000 and 999,999.

// .toString(): This converts the number to a string.

// So, the entire line of code generates a random 6-digit number and converts it to a string, which can be used as an OTP (One-Time Password).
