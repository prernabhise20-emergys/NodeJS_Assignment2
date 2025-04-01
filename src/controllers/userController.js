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
  checkAdminCount,
  updatePassword,
} from "../models/userModel.js";
import {
  ERROR_STATUS_CODE,
  SUCCESS_STATUS_CODE,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from "../common/constants/statusConstant.js";

dotenv.config();
const {
  USER_DELETED,
  USER_EXISTS,
  REGISTER_SUCCESS,
  INVALID_USER,
  ADD_ADMINS,
  REMOVE_ADMIN,
  USER_UPDATE,
  USER_NOT_FOUND,
  CANNOT_DELETE_USER,
} = AUTH_RESPONSES;

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

const addAdmin = async (req, res) => {
  try {
    const { admin: is_admin } = req.user;
    const { email } = req.body;

    await addAsAdmin(is_admin, email);
    throw ADD_ADMINS;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const removeAdmin = async (req, res) => {
  try {
    const { admin: is_admin } = req.user;
    const { email } = req.body;

    await removeAdminAuthority(is_admin, email);
    throw REMOVE_ADMIN;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const updateUser = async (req, res) => {
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

const deleteUser = async (req, res) => {
  try {
    const { userid: id, admin } = req.user;

    if (admin) {
      const adminCount = await checkAdminCount();

      if (adminCount <= 1) {
        throw CANNOT_DELETE_USER;
      }
    }

    await deleteUserData(id);

    res.json({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
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
      res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
        status: SUCCESS_STATUS_CODE.SUCCESS,
        message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
        data: user,
      });
    }
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
    await updatePassword(email, newPassword);
    res.json({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.PASSWORD_UPDATE,
    });
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
  addAdmin,
  removeAdmin,
};
