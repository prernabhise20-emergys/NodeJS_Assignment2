import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendVerificationEmail from "../common/utility/sendVerificationEmail.js";
import { ResponseHandler } from "../common/utility/handlers.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import sendOtpToEmail from "../common/utility/otpMail.js";
import formatDate from "../common/utility/formattedDate.js";
import {
  getAppointmentInfo,
  updateDoctorAppointment,
  updateUserPassword,
  getAppointmentHistory,
  getSearchedDoctor,
  checkDoctorAvailability,
  createDoctorAppointment,
  isDoctorAvailable,
  getDoctorInfo,
  getName,
  checkEmailExists,
  createUserData,
  checkIfUserExists,
  loginUser,
  getUserData,
  updateUserData,
  deleteUserData,
  checkAdminCount,
  updatePassword,
  loginWithUsercode,

} from "../models/userModel.js";
import {
  SUCCESS_STATUS_CODE,
  SUCCESS_MESSAGE,
  ERROR_STATUS_CODE,
  ERROR_MESSAGE
} from "../common/constants/statusConstant.js";

dotenv.config();
const { USER_EXISTS, INVALID_USER, CANNOT_DELETE_USER, LOGIN_CREDENTIAL } =
  AUTH_RESPONSES;


const register = async (req, res, next) => {
  try {
    const { body: { email, user_password, first_name, last_name, mobile_number } } = req;

    if(!email||!user_password||!first_name||!last_name||!mobile_number){
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
    const userExists = await checkIfUserExists(email);
    if (userExists) {
      throw USER_EXISTS;
    }
    const decodedPassword = Buffer.from(user_password, 'base64').toString('utf-8');

    await createUserData(
      email,
      user_password,
      first_name,
      last_name,
      mobile_number,

    );


    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '3h' });
    const loginToken = `http://localhost:5173/account/user/login?token=${token}`

    await sendVerificationEmail(email, loginToken);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.REGISTER_SUCCESS)
    );


  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, userCode, user_password } = req.body;

    if (!email && !userCode) {
      throw LOGIN_CREDENTIAL;
    }

    let user;

    if (userCode) {
      user = await loginWithUsercode(userCode);
    }

    if (email) {
      user = await loginUser(email);
    }

    if (!user) {
      throw INVALID_USER;
    }

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
        user_password: user.user_password,
        first_name: user.first_name,
        last_name: user.last_name,
        mobile_number: user.mobile_number,
        superAdmin: user.is_superadmin,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h", algorithm: "HS256" }
    );

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.LOGIN_SUCCESS_MESSAGE,
      token,
    });

  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const {
      body: { first_name, last_name, mobile_number },
    } = req;

    if(!first_name||!last_name||!mobile_number){
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
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
   catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { body: { email } } = req;
    if(!email){
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
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
    if(!email||!newPassword){
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
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

    const { oldPassword, newPassword } = req.body;
    const { userid, user_password } = req.user;
    if(!oldPassword||!newPassword){
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }

    const decodedoldPassword = Buffer.from(oldPassword, 'base64').toString('utf-8');

    const decodedPassword = Buffer.from(newPassword, 'base64').toString('utf-8');

    const passwordMatch = await bcrypt.compare(decodedoldPassword, user_password);


    if (!passwordMatch) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST)
        .send(new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.WRONG_PASSWORD));
    }

    const hashedNewPassword = await bcrypt.hash(decodedPassword, 10);

    await updateUserPassword(hashedNewPassword, userid);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.PASSWORD_UPDATE));

  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const doctorInfo = await getDoctorInfo();
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE, doctorInfo)
    );
  } catch (error) {
    next(error)
  }
};

const createAppointment = async (req, res, next) => {
  try{
  const { body: { patient_id, doctor_id, date, time,disease_type,disease_description } } = req;
  if(!doctor_id|| !date|| !time||!disease_type||!disease_description||!patient_id){
    return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
      new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
    );
  }
    const isAvailable = await isDoctorAvailable(doctor_id, date,patient_id);

    if (!isAvailable) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.BOOK_SLOT)
      );

    }

    const result = await createDoctorAppointment(patient_id, doctor_id, date, time,disease_type,disease_description);
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
    if(!doctor_id){
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
    const availableTimes = await checkDoctorAvailability(doctor_id, date);

    const doctorInTime = availableTimes[0]?.doctorInTime || 'Not Available';
    const doctorOutTime = availableTimes[0]?.doctorOutTime || 'Not Available';
 const is_availabile=availableTimes[0]?.is_available;

 const unavailable_from_date = availableTimes[0]?.unavailable_from_date
  ? formatDate(availableTimes[0].unavailable_from_date)
  : null;

const unavailable_to_date = availableTimes[0]?.unavailable_to_date
  ? formatDate(availableTimes[0].unavailable_to_date)
  : null;

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
        is_availabile,
        unavailable_from_date,
        unavailable_to_date
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

const appointmentHistory = async (req, res, next) => {
  try {
    const { query: { patient_id } } = req;
    if(!patient_id){
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
    const history = await getAppointmentHistory(patient_id);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE, history)
    );
  } catch (error) {
    next(error);
  }
};

const rescheduleAppointment=async(req,res,next)=>{
  try {
  const { body: { doctor_id, date, time,disease_type,disease_description } } = req;
  const{query:{appointment_id}}=req;

if(!doctor_id|| !date|| !time||!disease_type||!disease_description||!appointment_id){
  return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
    new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
  );
}
    const result = await updateDoctorAppointment( doctor_id, date, time,disease_type,disease_description,appointment_id);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.APPOINTMENT_RESCHEDULE)
    );

  } catch (error) {
    next(error);
  }
}
const getAppointmentData=async(req,res,next)=>{
  try {
    const{query:{appointment_id}}=req;
    if(!appointment_id){
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
    const doctorInfo = await getAppointmentInfo(appointment_id);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.APPOINTMENT_INFO_SUCCESS_MESSAGE, doctorInfo)
    );
  } catch (error) {
    next(error)
  }
}
export default {
  getAppointmentData,
  rescheduleAppointment,
  appointmentHistory,
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
