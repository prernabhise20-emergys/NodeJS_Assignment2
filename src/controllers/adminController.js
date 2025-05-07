import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  SUCCESS_STATUS_CODE,
  ERROR_STATUS_CODE
} from "../common/constants/statusConstant.js";
import jwt from "jsonwebtoken";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import { ResponseHandler } from "../common/utility/handlers.js"; 
import { approveRequest, approveAppointmentDoctorNotify } from "../common/utility/approveAppointment.js"
import sendCancelledAppointmentEmail from "../common/utility/cancelledAppointment.js";
import sendRegisterCode from "../common/utility/sendRegisterCode.js";
import {
  checkPrescription,
  checkIfUserExists,
  createAdmin,
  patientHaveAppointment,
  getAllEmailForAddDoctor,
  getAllEmailForAddAdmin,
  checkSuperAdmin,
  getAllAppointmentInformation,
  getPatientData,
  scheduleAppointment,
  changeStatus,
  deleteDoctorData,
  createDoctorData,
  ageGroupWiseData,
  deletePatientDetails,
  getInfo,
  getTotalCount,
  checkAdminCount,
  removeAdminAuthority,
  displayAdmin,
  displayRequest,
  getAllPatientAppointment,
  cancelStatus
} from "../models/adminModel.js";
const { APPOINTMENT_BOOKED, USER_EXISTS, UNAUTHORIZED_ACCESS, CANNOT_DELETE_SUPERADMIN, CANNOT_DELETE_USER } = AUTH_RESPONSES;

const getAllInfo = async (req, res, next) => {
  try {
    const { admin: is_admin } = req.user;

    if (!is_admin) {
      throw UNAUTHORIZED_ACCESS;
    }

    let { page, limit } = req.query;

    page = parseInt(page || 1, 10);

    limit = parseInt(limit)
    const offset = (page - 1) * limit;

    const [personalInfo, totalCount] = await Promise.all([
      getInfo(is_admin, limit, offset),
      getTotalCount(is_admin),
    ]);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status:SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
      data: personalInfo,
      pagination: {
        currentPage: page,
        limit,
        totalPatients: totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
const adminDeletePatientData = async (req, res, next) => {
  try {
    const { user: { admin: is_admin } } = req;
    const { query: { patient_id } } = req;

    const checkAppointment = await patientHaveAppointment(patient_id);
    if (checkAppointment.length > 0) {
      throw APPOINTMENT_BOOKED;
    }

    if (is_admin) {
      await deletePatientDetails(patient_id);

      return res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(
          SUCCESS_STATUS_CODE.SUCCESS,
          SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE
        ));
    }

  } catch (error) {
    next(error);
  }
};

const ageGroupData = async (req, res, next) => {
  try {
    const { user: { admin: is_admin } } = req;

    const ageGroup = await ageGroupWiseData(is_admin);

    const ageData = {
      Child: ageGroup.find((group) => group.ageGroup === "child")?.count || 0,
      Teen: ageGroup.find((group) => group.ageGroup === "teen")?.count || 0,
      Adults: ageGroup.find((group) => group.ageGroup === "adult")?.count || 0,
      Older: ageGroup.find((group) => group.ageGroup === "older")?.count || 0,
    };

    return res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,
          SUCCESS_MESSAGE.PATIENT_COUNT_SUCCESS_MESSAGE,
          ageData
        )
      );
  } catch (error) {
    next(error);
  }
};


const addAdmin = async (req, res, next) => {
  try {
    const { body: { email, user_password, first_name, last_name, mobile_number } } = req;

    const userExists = await checkIfUserExists(email);
    if (userExists) {
      throw USER_EXISTS;
    }

    const name = first_name + ' ' + last_name;
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const adminCode = `ADM${randomNumber}`;
    const data = {
      first_name,
      last_name,
      email,
      user_password,
      mobile_number
    }
    await createAdmin(data, adminCode)
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '3h' });
    const loginToken = `http://localhost:5173/account/user/login?token=${token}`
    await sendRegisterCode(email, name, adminCode, user_password, loginToken)

    return res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.ADD_ADMIN));
  } catch (error) {
    next(error);
  }
};

const removeAdmin = async (req, res, next) => {
  try {
    const { user: { admin: is_admin } } = req;
    const { body: { email } } = req;

    const isSuperAdmin = await checkSuperAdmin(email);

    if (isSuperAdmin) {
      throw CANNOT_DELETE_SUPERADMIN;
    }

    if (is_admin) {
      const adminCount = await checkAdminCount();

      if (adminCount <= 1) {
        throw CANNOT_DELETE_USER;
      }
    }

    await removeAdminAuthority(is_admin, email);

    return res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.REMOVE_ADMIN));
  } catch (error) {
    next(error);
  }
};

const getAdmin = async (req, res, next) => {
  try {
    const { user: { admin: is_admin } } = req;
    if (is_admin) {
      const user = await displayAdmin();

      return res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.GET_ADMIN, user));
    }
    return res
      .status(ERROR_STATUS_CODE.BAD_REQUEST)
      .send(new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.ADMIN_ACCESS));
  } catch (error) {
    next(error);
  }
};

const generateDoctorCode = async () => {
  const randomNumber = Math.floor(100 + Math.random() * 900);
  const newCode = `DR${randomNumber}`;

  return newCode;
};



const addDoctor = async (req, res, next) => {
  try {
    const { user: { admin: is_admin } } = req;
    const { body: { specialization, contact_number, email, doctorInTime, doctorOutTime, user_password, first_name, last_name } } = req;


    const userExists = await checkIfUserExists(email);
    if (userExists) {
      throw USER_EXISTS;
    }
    const docCode = await generateDoctorCode();

    const data = {
      name: first_name + ' ' + last_name,
      specialization,
      contact_number,
      email,
      doctorInTime,
      doctorOutTime,
      doctorCode: docCode,
      user_password,
      first_name,
      last_name
    };


    if (!is_admin) {
      return res
        .status(ERROR_STATUS_CODE.BAD_REQUEST)
        .send(new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.ADMIN_ACCESS));
    }

    const result = await createDoctorData(data);

    if (result) {
      const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '3h' });
      const loginToken = `http://localhost:5173/account/user/login?token=${token}`
      await sendRegisterCode(data.email, data.name, data.doctorCode, data.user_password, loginToken);
    }

    return res.status(SUCCESS_STATUS_CODE.CREATED).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.CREATED, SUCCESS_MESSAGE.ADDED_DOCTOR_INFO_MESSAGE, { doctor_id: result.insertId })
    );

  } catch (error) {
    next(error);
  }
};


const deleteDoctor = async (req, res, next) => {
  try {
    const { query: { doctor_id } } = req;

    await deleteDoctorData(doctor_id);
    return res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE));
  } catch (error) {
    next(error);
  }
};

const changeAppointmentsStatus = async (req, res, next) => {
  try {
    const { query: { status, appointment_id } } = req;
    const { user: { admin: is_admin, doctor: is_doctor, email } } = req;
    if (!status || !appointment_id) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.INVALID_INPUT)
      );
    }

    if(status == 'Completed'){

      const check= await checkPrescription(appointment_id)
      if(!check){
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.PRESCRIPTION_NOT_EXISTS)
        );
      }
      
    }
    if (is_admin || is_doctor) {
      const result = await changeStatus(status, appointment_id);

      if (result.affectedRows > 0) {
        if (status == 'Cancelled') {
          const data = await getPatientData(appointment_id);
          const patientName = data[0].patient_name;
          const appointmentDate = data[0].appointment_date;
          const appointmentTime = data[0].appointment_time;
          const doctorName = data[0].name;
          await sendCancelledAppointmentEmail(email, patientName, appointmentDate, appointmentTime, doctorName)
        }
        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
          new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.CHANGE_STATUS)
        );
      } else {
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.NOT_CHANGE_STATUS)
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

const setAppointmentCancelled = async (req, res, next) => {
  try {
    const { query: { appointment_id } } = req;
    const { user: { admin: is_admin, email } } = req;
    const { body: { reason } } = req

    if (!appointment_id) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.INVALID_INPUT)
      );
    }
    if (is_admin) {

      const result = await cancelStatus(appointment_id, reason);

      if (result.affectedRows) {

        const data = await getPatientData(appointment_id);
        const { patient_name, appointment_date, appointment_time, name, reason } = data[0]

        await sendCancelledAppointmentEmail(email, reason, patient_name, appointment_date, appointment_time, name)
        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
          new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.APPOINTMENT_CANCELLED)
        );
      } else {
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.FAILED_TO_CANCEL)
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

const approveAppointment = async (req, res, next) => {
  try {
    const { query: { appointment_id } } = req;
    const { user: { admin: is_admin, email } } = req;

    if (!appointment_id) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.INVALID_INPUT)
      );
    }
    if (is_admin) {
      const result = await scheduleAppointment(appointment_id);
      const data = await getPatientData(appointment_id);

      if (!data || data.length === 0) {
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.NOT_CHANGE_STATUS)
        );
      }

      const { patient_name, appointment_date, appointment_time, name, doctor_email } = data[0];

      const { user: { email } } = req;

      if (result.affectedRows == 1) {
        await approveRequest(email, patient_name, appointment_date, appointment_time, name);
        await approveAppointmentDoctorNotify(name, patient_name, appointment_date, appointment_time, doctor_email);
        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
          new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.CHANGE_STATUS)
        );
      } else {
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.NOT_CHANGE_STATUS)
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

const displayAppointmentRequest = async (req, res, next) => {
  try {
    const { user: { admin: is_admin } } = req;
    if (is_admin) {
      const user = await displayRequest();

      return res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.REQUESTED_APPOINTMENT, user));
    }
    return res
      .status(ERROR_STATUS_CODE.BAD_REQUEST)
      .send(new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.ADMIN_ACCESS));
  } catch (error) {
    next(error);
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const { user: { admin, doctor } } = req;
    const { query: { doctor_id } } = req;
    if (admin || doctor) {
      const appointments = await getAllAppointmentInformation(doctor_id);


      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.ALL_APPOINTMENTS, {
          appointments
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

const getPatientsAppointments = async (req, res, next) => {
  try {
    const { user: { admin, doctor } } = req;

    if (admin || doctor) {
      const appointments = await getAllPatientAppointment();

      const formattedAppointments = appointments.map(appointment => ({
        ...appointment,
        appointment_date: new Date(appointment.appointment_date).toISOString().split('T')[0]
      }));

      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.ALL_APPOINTMENTS, { appointments: formattedAppointments })
      );
    }
  } catch (error) {
    next(error);
  }
};


const getAllEmail = async (req, res, next) => {
  try {
    const { user: { admin, doctor } } = req;

    if (admin || doctor) {
      const emails = await getAllEmailForAddAdmin();

      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.EMAIL_RETRIVE, emails)
      );
    }
  } catch (error) {
    next(error);
  }
};

const getAllEmailForDoctor = async (req, res, next) => {
  try {
    const { user: { admin, doctor } } = req;

    if (admin || doctor) {
      const emails = await getAllEmailForAddDoctor();

      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.EMAIL_RETRIVE, emails)
      );
    }
  } catch (error) {
    next(error);
  }
};

export default {
  setAppointmentCancelled,
  getAllEmailForDoctor,
  getAllEmail,
  getPatientsAppointments,
  getAllAppointments,
  displayAppointmentRequest,
  approveAppointment,
  changeAppointmentsStatus,
  deleteDoctor,
  addDoctor,
  addAdmin,
  removeAdmin,
  getAdmin,
  ageGroupData,
  adminDeletePatientData,
  getAllInfo,
};


