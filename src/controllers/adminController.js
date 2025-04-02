import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  SUCCESS_STATUS_CODE,
} from "../common/constants/statusConstant.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import { ResponseHandler } from "../common/utility/handlers.js";

import {
  doctorFlag,
  createDoctorData,
  ageGroupWiseData,
  deletePatientDetails,
  getInfo,
  getTotalCount,
  addAsAdmin,
  checkAdminCount,
  removeAdminAuthority,
  displayAdmin,
} from "../models/adminModel.js";
const { UNAUTHORIZED_ACCESS, NOT_DELETED } = AUTH_RESPONSES;

const getAllInfo = async (req, res, next) => {
  try {
    const { admin: is_admin } = req.user;

    if (!is_admin) {
      throw UNAUTHORIZED_ACCESS;
    }
    let { page, limit, documentSize } = req.query;
    page = parseInt(page || 1);
    limit = parseInt(limit || 10);
    documentSize = parseInt(documentSize || 4);

    limit = limit * documentSize;

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
        limit: limit / documentSize,
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




const addDoctor = async (req, res,next) => {
  try {
    const {
      body: {
       name,
       specialization,
       contact_number,
      },
    } = req;

    const { userid: id,admin:is_admin,email:doctor_email} = req.user;
    const data = {
      name,
       specialization,
       contact_number,
       email:doctor_email
    };
    console.log(data);
    
if(is_admin){
    const result = await createDoctorData(data, id);
    if(result){
 await doctorFlag();
    }
    res.status(SUCCESS_STATUS_CODE.CREATED).send(
      new ResponseHandler(SUCCESS_MESSAGE.ADDED_DOCTOR_INFO_MESSAGE)
    );
  }
  } catch (error) {
  next(error)
  }
};

export default {
  addDoctor,
  addAdmin,
  removeAdmin,
  getAdmin,
  ageGroupData,
  adminDeletePatientData,
  getAllInfo,
};
