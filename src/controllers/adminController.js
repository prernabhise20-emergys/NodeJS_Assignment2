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
  getAllEmailForAddDoctor,
  getAllEmailForAddAdmin,
  checkDoctor,
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
  getAllPatientAppointment
} from "../models/adminModel.js";
const { UNAUTHORIZED_ACCESS, NOT_DELETED } = AUTH_RESPONSES;

const getAllInfo = async (req, res, next) => {
  try {
    const { admin: is_admin } = req.user;

    if (!is_admin) {
      throw UNAUTHORIZED_ACCESS;
    }
    let { page, limit } = req.query;
    page = parseInt(page || 1);
    limit = parseInt(limit || 10);
    // documentSize = parseInt(documentSize || 4);

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
    console.log(patient_id);

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
    const {
      body: {
        specialization,
        email,
        doctorInTime,
        doctorOutTime
      },
    } = req;

    const { admin: is_admin } = req.user;

    console.log(req.body);

    // Check if the doctor exists in the user table
    const checkDoctor1 = await checkDoctor(email);
    console.log('checkdoctor',checkDoctor1);

    if (checkDoctor1.length > 0) {
      var user_id = checkDoctor1[0].id; // Assign user_id
    } else {
      return res.status(400).send(new ResponseHandler("User not found"));
    }

    const data = {
      name:checkDoctor1[0].first_name +' '+ checkDoctor1[0].last_name,
      specialization,
      contact_number:checkDoctor1[0].mobile_number,
      email,
      user_id,
      doctorInTime,
      doctorOutTime
    };

    console.log(data);

    if (is_admin) {
      const result = await createDoctorData(data);
      return res.status(SUCCESS_STATUS_CODE.CREATED).send(
        new ResponseHandler(SUCCESS_MESSAGE.ADDED_DOCTOR_INFO_MESSAGE, { doctor_id: result.insertId })
      );
    }

    return res
      .status(SUCCESS_STATUS_CODE.SUCCESS)
      .send(new ResponseHandler(ERROR_MESSAGE.ADMIN_ACCESS));
  } catch (error) {
    next(error);
  }
};






// const addDoctor = async (req, res, next) => {
//   try {
//     const {
//       body: {
//         name,
//         specialization,
//         contact_number,
//         email,
//         doctorInTime,
//         doctorOutTime
//       },
//     } = req;

//     const {admin: is_admin } = req.user;
// console.log(req.body);

// const checkDoctor1=await checkDoctor(email);
// console.log(checkDoctor1);

//     const data = {
//       name,
//       specialization,
//       contact_number,
//       email,
//       user_id,
//       doctorInTime,
//       doctorOutTime
//     };
//     console.log(data);

//     if (is_admin) {
//       const result = await createDoctorData(data);
//       res.status(SUCCESS_STATUS_CODE.CREATED).send(
//         new ResponseHandler(SUCCESS_MESSAGE.ADDED_DOCTOR_INFO_MESSAGE, { doctor_id: result.insertId })
//       );
//     }
//     res
//       .status(SUCCESS_STATUS_CODE.SUCCESS)
//       .send(new ResponseHandler(ERROR_MESSAGE.ADMIN_ACCESS));
//   } catch (error) {
//     next(error)
//   }
// };

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
      console.log(patientName, appointmentDate, appointmentTime, doctorName);
      console.log(result);

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

      console.log(appointments);

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
      console.log(appointments);

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


const getAllEmail= async (req, res, next) => {
  try {
    const { admin, doctor } = req.user;

    if (admin || doctor) {
      const emails = await getAllEmailForAddAdmin();
      console.log(emails);



      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.EMAIL_RETRIVE,emails )
      );
    }
  } catch (error) {
    next(error);
  }
};


const getAllEmailForDoctor= async (req, res, next) => {
  try {
    const { admin, doctor } = req.user;

    if (admin || doctor) {
      const emails = await getAllEmailForAddDoctor();
      console.log(emails);



      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.EMAIL_RETRIVE,emails )
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


