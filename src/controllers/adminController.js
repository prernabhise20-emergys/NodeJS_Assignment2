import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  SUCCESS_STATUS_CODE,
  ERROR_STATUS_CODE
} from "../common/constants/statusConstant.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import { ResponseHandler } from "../common/utility/handlers.js";
import approveRequest from "../common/utility/approveAppointment.js"

import {
  getUserRegisterDetails,
  setIsDoctor,
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
  addAsAdmin,
  checkAdminCount,
  removeAdminAuthority,
  displayAdmin,
  displayRequest,
  getAllPatientAppointment,
} from "../models/adminModel.js";
const { UNAUTHORIZED_ACCESS, NOT_DELETED, CANNOT_DELETE_SUPERADMIN, CANNOT_DELETE_USER } = AUTH_RESPONSES;


const getAllInfo = async (req, res, next) => {
  try {
    const { admin: is_admin } = req.user;

    if (!is_admin) {
      throw UNAUTHORIZED_ACCESS;
    }
    let { page, limit } = req.query;
    page = parseInt(page || 1);
    limit = parseInt(limit || 10);

    limit = limit * 4;

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
        limit: limit / 4,
        totalPatients: totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const adminDeletePatientData = async (req, res, next) => {
  try {
    const { admin: is_admin } = req.user;
    const { patient_id } = req.query;

    if (is_admin) {
      await deletePatientDetails(patient_id);

      res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE));
    }
    throw NOT_DELETED;
  } catch (error) {
    next(error);
  }
};

// ********************************************************************

const ageGroupData = async (req, res, next) => {
  try {
    const { admin: is_admin } = req.user;

    const ageGroup = await ageGroupWiseData(is_admin);

    const ageData = {
      Child: ageGroup.find((group) => group.ageGroup === "child")?.count || 0,
      Teen: ageGroup.find((group) => group.ageGroup === "teen")?.count || 0,
      Adults: ageGroup.find((group) => group.ageGroup === "adult")?.count || 0,
      Older: ageGroup.find((group) => group.ageGroup === "older")?.count || 0,
    };

    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(
        new ResponseHandler(
          SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
          ageData
        )
      );
  } catch (error) {
    next(error);
  }
};

const addAdmin = async (req, res, next) => {
  try {
    const { admin: is_admin } = req.user;
    const { email } = req.body;

    await addAsAdmin(is_admin, email);

    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_MESSAGE.ADD_ADMIN));
  } catch (error) {
    next(error);
  }
};

const removeAdmin = async (req, res, next) => {
  try {
    const { admin: is_admin } = req.user;
    const { email } = req.body;

    console.log(email);

    const isSuperAdmin = await checkSuperAdmin(email);
    console.log('superadmin', isSuperAdmin);

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

    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_MESSAGE.REMOVE_ADMIN));
  } catch (error) {
    next(error);
  }
};



const getAdmin = async (req, res, next) => {
  try {
    const { admin: is_admin } = req.user;
    if (is_admin) {
      const user = await displayAdmin();

      res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_MESSAGE.GET_ADMIN, user));
    }
    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(ERROR_MESSAGE.ADMIN_ACCESS));
  } catch (error) {
    next(error);
  }
};
const addDoctor = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { admin: is_admin = false } = req.user || {};

    const userDetails = await getUserRegisterDetails(id);

    if (!userDetails) {
      return res.status(SUCCESS_STATUS_CODE.NOT_FOUND).send(
        new ResponseHandler(ERROR_MESSAGE.USER_NOT_FOUND)
      );
    }

    const { email, first_name, last_name, mobile_number } = userDetails;

    const { body: { specialization, doctorInTime, doctorOutTime } } = req;

    const data = {
      name: first_name + ' ' + last_name,
      specialization,
      contact_number: mobile_number,
      email,
      user_id: id,
      doctorInTime,
      doctorOutTime,
    };


    if (is_admin) {
      const result = await createDoctorData(data);

      if (result) {
        await setIsDoctor(id);
      }

      return res.status(SUCCESS_STATUS_CODE.CREATED).send(
        new ResponseHandler(SUCCESS_MESSAGE.ADDED_DOCTOR_INFO_MESSAGE, { doctor_id: result.insertId })
      );
    }

    return res
      .status(SUCCESS_STATUS_CODE.UNAUTHORIZED)
      .send(new ResponseHandler(ERROR_MESSAGE.ADMIN_ACCESS));
  } catch (error) {
    next(error);
  }
};




const deleteDoctor = async (req, res, next) => {
  try {
    const { doctor_id } = req.query;

    await deleteDoctorData(doctor_id);
    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE));
  } catch (error) {
    next(error);
  }
};

const changeAppointmentsStatus = async (req, res, next) => {
  try {
    const { status, appointment_id } = req.query;
    const { admin: is_admin } = req.user;
    if (!status || !appointment_id) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_MESSAGE.INVALID_INPUT)
      );
    }
    if (is_admin) {
      const result = await changeStatus(status, appointment_id);

      if (result.affectedRows > 0) {
        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
          new ResponseHandler(SUCCESS_MESSAGE.CHANGE_STATUS)
        );
      } else {
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_MESSAGE.NOT_CHANGE_STATUS)
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

const approveAppointment = async (req, res, next) => {
  try {
    const { appointment_id } = req.query;
    const { admin: is_admin, email } = req.user;

    if (!appointment_id) {
      return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
        new ResponseHandler(ERROR_MESSAGE.INVALID_INPUT)
      );
    }
    if (is_admin) {
      const result = await scheduleAppointment(appointment_id);
      const data = await getPatientData(appointment_id);

      if (!data || data.length === 0) {
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_MESSAGE.NOT_CHANGE_STATUS)
        );
      }

      const patientName = data[0].patient_name;
      const appointmentDate = data[0].appointment_date;
      const appointmentTime = data[0].appointment_time;
      const doctorName = data[0].name;


      if (result.affectedRows == 1) {
        await approveRequest(email, patientName, appointmentDate, appointmentTime, doctorName);

        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
          new ResponseHandler(SUCCESS_MESSAGE.CHANGE_STATUS)
        );
      } else {
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_MESSAGE.NOT_CHANGE_STATUS)
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

const displayAppointmentRequest = async (req, res, next) => {
  try {
    const { admin: is_admin } = req.user;
    if (is_admin) {
      const user = await displayRequest();

      res
        .status(SUCCESS_STATUS_CODE.SUCCESS)
        .send(new ResponseHandler(SUCCESS_MESSAGE.REQUESTED_APPOINTMENT, user));
    }
    res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(ERROR_MESSAGE.ADMIN_ACCESS));
  } catch (error) {
    next(error);
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const { admin, doctor } = req.user;
    const { doctor_id } = req.query;
    if (admin || doctor) {
      const appointments = await getAllAppointmentInformation(doctor_id);


      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.ALL_APPOINTMENTS, {
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
    const { admin, doctor } = req.user;

    if (admin || doctor) {
      const appointments = await getAllPatientAppointment();

      const formattedAppointments = appointments.map(appointment => ({
        ...appointment,
        appointment_date: new Date(appointment.appointment_date).toISOString().split('T')[0]
      }));

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.ALL_APPOINTMENTS, { appointments: formattedAppointments })
      );
    }
  } catch (error) {
    next(error);
  }
};


const getAllEmail = async (req, res, next) => {
  try {
    const { admin, doctor } = req.user;

    if (admin || doctor) {
      const emails = await getAllEmailForAddAdmin();

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.EMAIL_RETRIVE, emails)
      );
    }
  } catch (error) {
    next(error);
  }
};

const getAllEmailForDoctor = async (req, res, next) => {
  try {
    const { admin, doctor } = req.user;

    if (admin || doctor) {
      const emails = await getAllEmailForAddDoctor();

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.EMAIL_RETRIVE, emails)
      );
    }
  } catch (error) {
    next(error);
  }
};

export default {
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


