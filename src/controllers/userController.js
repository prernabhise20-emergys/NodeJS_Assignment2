import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendVerificationEmail from "../common/utility/sendVerificationEmail.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import {
  checkAlreadyExist,
  getDeleteUserInfo,
  createUserData,
  checkIfUserExists,
  loginUser,
  getUserData,
  updateUserData,
  deleteUserData,
  addAsAdmin,
  checkAdminCount,
  removeAdminAuthority,
  check
} from "../models/userModel.js";
import {
  ERROR_STATUS_CODE,
  SUCCESS_STATUS_CODE,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from "../common/constants/statusConstant.js";

dotenv.config();
const {
  USER_EXISTS,
  REGISTER_SUCCESS,
  INVALID_USER,
  ADD_ADMINS,
  REMOVE_ADMIN,
  USER_UPDATE,
  USER_DELETED,
    CANNOT_DELETE_USER,
} = AUTH_RESPONSES;

const register = async (req, res) => {
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
    throw REGISTER_SUCCESS;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, user_password } = req.body;
const check1 = await check(email)
if(check1){
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
      res.json({
        message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
        token,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).json({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
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
      body: { email, user_password, first_name, last_name, mobile_number },
    } = req;
    const { userid: id } = req.user;

    const formData = {
      email,
      user_password,
      first_name,
      last_name,
      mobile_number,
    };

    await updateUserData(formData, id);
    throw USER_UPDATE;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};
const getUser = async (req, res) => {
  try {
    const { userid: id, email: emailID } = req.user;
    const checkExists = await checkAlreadyExist(emailID);

    if (checkExists) {
      const deletedUserInfo = await getDeleteUserInfo(emailID);
      if (deletedUserInfo) {
        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
          status: SUCCESS_STATUS_CODE.SUCCESS,
          message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
          data: deletedUserInfo,
        });
      }
    }
else{
    const user = await getUserData(id);
    res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
      data: user,
    });
  }
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
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

export default {
  register,
  login,
  getUser,
  updateUser,
  deleteUser,
  addAdmin,
  removeAdmin,
};
