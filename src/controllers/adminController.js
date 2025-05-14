import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  SUCCESS_STATUS_CODE,
  ERROR_STATUS_CODE
} from "../common/constants/statusConstant.js";
import xlsx from 'xlsx';
import jwt from "jsonwebtoken";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import { ResponseHandler } from "../common/utility/handlers.js";
import { approveRequest, approveAppointmentDoctorNotify } from "../common/utility/approveAppointment.js"
import sendCancelledAppointmentEmail from "../common/utility/cancelledAppointment.js";
import sendRegisterCode from "../common/utility/sendRegisterCode.js";
import axios from 'axios';
import fs from 'fs';
// import Buffer from "Buffer";
import convertToTimeFormat from '../common/utility/formattedDate.js'
// import generateDoctorCode from '../common/utility/generatedNumber.js'
// import generatePassword from '../common/utility/generatedNumber.js'
import response1 from '../common/constants/pathConstant.js';
import filePath from '../common/constants/pathConstant.js'

import {
  updateLeaveApproval,
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
const { NO_FILE_FOUND, APPOINTMENT_BOOKED, USER_EXISTS, UNAUTHORIZED_ACCESS, CANNOT_DELETE_SUPERADMIN, CANNOT_DELETE_USER } = AUTH_RESPONSES;

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
      status: SUCCESS_STATUS_CODE.SUCCESS,
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
    if (!patient_id) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
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
    else {
      return res
        .status(ERROR_STATUS_CODE.BAD_REQUEST)
        .send(new ResponseHandler(
          ERROR_STATUS_CODE.BAD_REQUEST,
          ERROR_MESSAGE.NOT_DELETE_MESSAGE
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
    if (!email || !first_name || !last_name || !mobile_number) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
    const password = await generatePassword(first_name)
    console.log("Admin Password:", password);

    const name = first_name + ' ' + last_name;
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const adminCode = `ADM${randomNumber}`;
    const data = {
      first_name,
      last_name,
      email,
      user_password: password,
      mobile_number
    }
    const addAdmin = await createAdmin(data, adminCode);
    if (addAdmin) {
      const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '3h' });
      const loginToken = `http://localhost:5173/account/user/login?token=${token}`
      await sendRegisterCode(email, name, adminCode, user_password, loginToken)

      return res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.ADD_ADMIN));
    }
    else {
      return res
        .status(ERROR_STATUS_CODE.BAD_REQUEST)
        .send(new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.FAILED_ADD_ADMIN));
    }
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

    const deleteAdmin = await removeAdminAuthority(is_admin, email);
    if (deleteAdmin) {
      return res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.REMOVE_ADMIN));
    }
    else {
      return res
        .status(ERROR_STATUS_CODE.BAD_REQUEST)
        .send(new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.FAILED_REMOVE_ADMIN));
    }
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
const generatePassword = async (first_name) => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  const newCode = `${first_name}@${randomNumber}`;

  return newCode;
};
const addDoctor = async (req, res, next) => {
  try {
    const { user: { admin: is_admin } } = req;
    const { body: { specialization, contact_number, email, doctorInTime, doctorOutTime, first_name, last_name, leave_approval_senior_doctor_id } } = req;

    const userExists = await checkIfUserExists(email);
    if (userExists) {
      throw USER_EXISTS;
    }
    const docCode = await generateDoctorCode();
    const password = await generatePassword(first_name)
    console.log("Doctor Password:", password);
    console.log("code", docCode);

    const data = {
      name: first_name + ' ' + last_name,
      specialization,
      contact_number,
      email,
      doctorInTime,
      doctorOutTime,
      doctorCode: docCode,
      user_password: password,
      first_name,
      last_name,
      leave_approval_senior_doctor_id
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


      return res.status(SUCCESS_STATUS_CODE.CREATED).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.CREATED, SUCCESS_MESSAGE.ADDED_DOCTOR_INFO_MESSAGE, { doctor_id: result.insertId })
      );
    }
    else {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.FAILED_ADD_DOCTOR)
      );
    }
  } catch (error) {
    next(error);
  }
};


const deleteDoctor = async (req, res, next) => {
  try {
    const { query: { doctor_id } } = req;

    const deleteDoc = await deleteDoctorData(doctor_id);
    if (deleteDoc) {
      return res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE));
    }
    else {
      return res
        .status(ERROR_STATUS_CODE.BAD_REQUEST)
        .send(new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.FAILED_DELETE_DOCTOR));
    }
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
    const { user: { admin: is_admin, email, doctor: is_doctor } } = req;
    const { body: { reason } } = req


    if (is_admin || is_doctor) {

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
    const { user: { admin: is_admin, email, doctor: is_doctor } } = req;

    if (!appointment_id) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.INVALID_INPUT)
      );
    }

    if (is_admin || is_doctor) {
      const result = await scheduleAppointment(appointment_id);
      const data = await getPatientData(appointment_id);

      if (!data || data.length === 0) {
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.NOT_CHANGE_STATUS)
        );
      }

      const { patient_name, appointment_date, appointment_time, name, doctor_email } = data[0];



      if (result) {
        await approveRequest(email, patient_name, appointment_date, appointment_time, name);
        await approveAppointmentDoctorNotify(name, patient_name, appointment_date, appointment_time, doctor_email);

        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
          new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.CHANGE_STATUS)
        );
      } else {
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.FAILED_TO_APPROVE)
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
    if (!doctor_id) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
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
const downloadDocument = async (req, res, next) => {
  try {

    const response = await axios({
      method: 'GET',
      url: response1.response1,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath.filePath);

    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('Download completed', filePath.filePath);
      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.TEMPLATE_DOWNLOAD, filePath.filePath)
      );
    });

    writer.on('error', (error) => {
      console.error('Error', error);
    });

  } catch (error) {
    next(error)
  }
};
const uploadDoctorsFromExcel = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      throw NO_FILE_FOUND;
    }

    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const records = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    const errors = [];
    const insertedDoctors = [];

    for (const [index, row] of records.entries()) {
      const {
        first_name,
        last_name,
        contact_number,
        email,
        specialization,
        doctorInTime,
        doctorOutTime
      } = row;

      console.log(`Row ${index + 2}:`, {
        first_name,
        last_name,
        contact_number,
        email,
        specialization,
        doctorInTime,
        doctorOutTime
      });

      if (![first_name, last_name, email, contact_number, specialization, doctorInTime, doctorOutTime].every(Boolean)) {
        errors.push({ row: index + 2, email: email || null });
        continue;
      }

      if (await checkIfUserExists(email)) {
        errors.push({ row: index + 2, email, error: 'User already exists' });
        continue;
      }
      const doctorCode = String(contact_number).padStart(4, '0').slice(-4);
      const user_password = `${first_name.toLowerCase()}@${doctorCode}`;

      const doctorData = {
        name: `${first_name} ${last_name}`,
        specialization,
        contact_number,
        email,
        doctorInTime: convertToTimeFormat(doctorInTime),
        doctorOutTime: convertToTimeFormat(doctorOutTime),
        doctorCode,
        user_password,
        first_name,
        last_name
      };

      try {
        const result = await createDoctorData(doctorData);
        insertedDoctors.push({ email, doctor_id: result.insertId });

        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '3h' });
        const loginToken = `http://localhost:5173/account/user/login?token=${token}`;

        await sendRegisterCode(email, doctorData.name, doctorCode, user_password, loginToken);
      } catch (err) {
        errors.push({ row: index + 2, email, error: err.message });
      }
    }


    return res.status(200).send(new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.ADD_DOCTOR, {
      inserted: insertedDoctors.length,
      failed: errors.length,
      errors
    }));

  } catch (error) {
    next(error);
  }
};

const changeLeaveApproval = async (req, res, next) => {
  try {
    const { query: { leave_approval_senior_doctor_id, doctor_id } } = req;

    if (!leave_approval_senior_doctor_id || !doctor_id) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
      );
    }
    const changeApproval = await updateLeaveApproval(leave_approval_senior_doctor_id, doctor_id)
    if (changeApproval) {
      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.CHANGE_LEAVE_APPROVAL)
      );
    } else {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.FAILED_CHANGE_LEAVE_APPROVAL)
      );
    }
  }
  catch (error) {
    next(error)
  }
}

export default {
  changeLeaveApproval,
  uploadDoctorsFromExcel,
  downloadDocument,
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


