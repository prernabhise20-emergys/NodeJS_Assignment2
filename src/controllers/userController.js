import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendVerificationEmail from "../common/utility/sendVerificationEmail.js";
import { ResponseHandler } from "../common/utility/handlers.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import sendOtpToEmail from "../common/utility/otpMail.js";
import {
  updateUserPassword,
  setIsDoctor,
  getSearchedDoctor,
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
  addAsAdmin,
  
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
    const { body: { email, user_password, first_name, last_name, mobile_number, userCode } } = req;

    const userExists = await checkIfUserExists(email);
    if (userExists) {
      throw USER_EXISTS;
    }
    const decodedPassword = Buffer.from(user_password, 'base64').toString('utf-8');

    await createUserData(
      email,
      decodedPassword,
      first_name,
      last_name,
      mobile_number,
      userCode
    );


    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '3h' });
    const loginToken = `http://localhost:5173/account/user/login?token=${token}`

    await sendVerificationEmail(email, loginToken);

    // if (userCode.startsWith("DR")) {
    //   await setIsDoctor(email);
    //   return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
    //     new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, "doctor registration")
    //   );
    // }
    // if (userCode.startsWith("ADM")) {
    //   await addAsAdmin(email);
    //   return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
    //     new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, "admin registration")
    //   );
    // }
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.REGISTER_SUCCESS)
    );


  } catch (error) {
    next(error);
  }
};



const login = async (req, res, next) => {
  try {
    const { body: { email, user_password } } = req;

    const isDeleted = await checkUserDeleteOrNot(email);
    if (isDeleted) {
      throw USER_DELETED;
    }

    const user = await loginUser(email);
    if (!user) {
      throw INVALID_USER;
    }
console.log(user_password);
console.log(user.user_password);


    const decodedPassword = Buffer.from(user_password, 'base64').toString('utf-8');
    const passwordMatch = await bcrypt.compare(decodedPassword, user.user_password);

    if (!passwordMatch) {
      throw INVALID_USER;
    }

    const token = jwt.sign(
      {
        userid: user.id,
        email: user.email,
        admin: user.is_admin,
        doctor: user.is_doctor,
        first_name: user.first_name,
        last_name: user.last_name,
        mobile_number: user.mobile_number,
        superAdmin: user.is_superadmin
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h", algorithm: "HS256" }
    );

    // if (user.is_admin|| user.is_superadmin) {
    // return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
    //     message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
    //     admin_message: user.is_admin,
    //     superAdmin_message: user.is_superadmin,
    //     token,
    //   });
    // }

    // if (user.is_doctor) {
    //   return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
    //     message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
    //     doctor_message: user.is_doctor,
    //     token,
    //   });
    // }
    // else {
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
      token,
    });
    // }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const {
      body: { first_name, last_name, mobile_number },
    } = req;
    const { user: { userid: id } } = req;

    const formData = {
      first_name,
      last_name,
      mobile_number,
    };

    await updateUserData(formData, id);
    return res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.USER_UPDATE_SUCCESS_MSG));
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { user: { userid: id, admin } } = req;

    if (admin) {
      const adminCount = await checkAdminCount();

      if (adminCount <= 1) {
        throw CANNOT_DELETE_USER;
      }
    }

    await deleteUserData(id);
    return res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE));
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { user: { userid: id, email: emailID } } = req;
    const checkExists = await checkAlreadyExist(emailID);

    if (checkExists) {
      const deletedUserInfo = await getDeleteUserInfo(emailID);
      if (deletedUserInfo) {
       return res
          .status(SUCCESS_STATUS_CODE.SUCCESS)
          .send(
            new ResponseHandler(
              SUCCESS_STATUS_CODE.SUCCESS,
              SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
              deletedUserInfo
            )
          );
      }
    } else {
      const user = await getUserData(id);
      return res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(
          new ResponseHandler(
            SUCCESS_STATUS_CODE.SUCCESS,
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
    const { body: { email } } = req;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const validEmail = await checkEmailExists(email);

    if (validEmail) {
      const name = await getName(email)

      await sendOtpToEmail(email, name, otp);

      const hashOtp = await bcrypt.hash(otp, 10);

      return res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.OTP_SENT, { hashOtp }));
    }
    return res
      .status(ERROR_STATUS_CODE.BAD_REQUEST)
      .send(new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.EMAIL_NOT_EXISTS));
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { body: { email, newPassword } } = req;
    await updatePassword(email, newPassword);
   return res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.PASSWORD_UPDATE));
  } catch (error) {
    next(error);
  }
};
const changePassword = async (req, res, next) => {
  try {
    const { body: { oldPassword, newPassword } } = req;
const {email,userid}=req.user;
console.log(req.user);

console.log(email);
    // const oldHashPassword = await bcrypt.hash(oldPassword, 10);
console.log(userid);

    await updateUserPassword(newPassword,userid);
    return res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.PASSWORD_UPDATE));

  } catch (error) {
    next(error);
  }
};
const getDoctors = async (req, res, next) => {
  try {

    const personalInfo = await getDoctorInfo();
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE, personalInfo)
    );
  } catch (error) {
    next(error)
  }
};

const createAppointment = async (req, res, next) => {
  const { body: { patient_id, doctor_id, date, time } } = req;
  try {
    const isAvailable = await isDoctorAvailable(doctor_id, date, time);

    if (!isAvailable) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.BOOK_SLOT)
      );

    }

    const result = await createDoctorAppointment(patient_id, doctor_id, date, time);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.APPOINTMENT_BOOKED, { appointment_id: result.insertId })
    );

  } catch (error) {
    next(error);
  }
};

const getDoctorAvailability = async (req, res, next) => {
  try {
    const { query: { doctor_id } } = req;
    const { body: { date } } = req;

    const availableTimes = await checkDoctorAvailability(doctor_id, date);

    // if (!availableTimes || availableTimes.length === 0) {
    //   return res.status(ERROR_STATUS_CODE.NOT_FOUND).send(
    //     new ResponseHandler(ERROR_MESSAGE.DOCTOR_NOT_AVAILABLE)
    //   );
    // }

    const doctorInTime = availableTimes[0]?.doctorInTime || 'Not Available';
    const doctorOutTime = availableTimes[0]?.doctorOutTime || 'Not Available';

    const scheduleSlots = availableTimes
      .filter(row => row.appointment_time !== null && row.status === 'Scheduled')
      .map(row => row.appointment_time);

    const pendingSlots = availableTimes
      .filter(row => row.appointment_time !== null && row.status === 'Pending')
      .map(row => row.appointment_time);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.AVAILABLE_SLOT, {
        doctorInTime,
        doctorOutTime,
        scheduleSlots,
        pendingSlots,
      })
    );
  } catch (error) {
    next(error);
  }
};

const searchDoctor = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.KEYWORD_REQUIRED)
      );
    }
    const doctor = await getSearchedDoctor(keyword);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DOCTOR_INFO_SUCCESS_MESSAGE, doctor)
    );

  } catch (error) {
    next(error);
  }
};

export default {
  searchDoctor,
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
  changePassword
};
