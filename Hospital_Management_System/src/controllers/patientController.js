import { MESSAGE, STATUS_CODE } from "../common/constants/statusConstant.js";
import { uploadFile } from "../common/utility/upload.js";

import {
  createPersonalDetails,
  updatePersonalDetails,
  getInfo,
  deletePersonalDetails,
  addDiseaseData,
  insertFamilyInfo,
  getPatientInfo,
  updateFamilyInfo,
  deleteFamilyInfo,
  updateDiseaseDetails,
  deleteDiseaseDetails,
  saveDocument,
  checkPersonalInfo,
  checkFamilyInfo,
  checkDiseaseInfo,
} from "../models/patientModel.js";

const getAllInfo = async (req, res) => {
  try {
    const { admin: is_admin } = req.user;

    if (!is_admin) {
      throw{
        status: STATUS_CODE.INVALID,
        message: MESSAGE.UNAUTHORIZED_ACCESS_MESSAGE,
      };
    }

    let { page = 1 } = req.query;
    page = parseInt(page, 10);
    const limit = 10;
    const offset = (page - 1) * limit;

    console.log( is_admin, limit, offset);
    
    const personalInfo = await getInfo(is_admin, limit, offset);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
      data: personalInfo,
      pagination: {
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status ||STATUS_CODE.ERROR).send({
      status:error.status || STATUS_CODE.ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};
// *****************************************************************


const showPatientDetails = async (req, res) => {
  try {
    const { userid: id } = req.user;

    const patientInfo = await getPatientInfo(id);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
      data: patientInfo,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status ||STATUS_CODE.ERROR).send({
      status:error.status || STATUS_CODE.ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};


// *********************************************************************
const createPersonalInfo = async (req, res) => {
  try {
    const {
      body: {
        date_of_birth,
        weight,
        height,
        country_of_origin,
        is_diabetic,
        cardiac_issue,
        blood_pressure,
      },
    } = req;

    const { userid: id, email: email } = req.user;
    const data = {
      date_of_birth,
      weight,
      height,
      country_of_origin,
      is_diabetic,
      cardiac_issue,
      blood_pressure,
    };

    const idExists = await checkPersonalInfo(id);
    if (idExists) {
      throw{
        status: STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.PERSONAL_INFO_EXISTS,
      };
    }
    const users = await createPersonalDetails(data, id, email);

    throw{
      status: STATUS_CODE.CREATED,
      message: MESSAGE.ADDED_PERSONAL_INFO_MESSAGE,
      data: users,
    };
  } catch (error) {
    console.error(error.message);
    return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
      status:error.status || STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const updatePersonalInfo = async (req, res) => {
  try {
    const {
      body: {
        date_of_birth,
        weight,
        height,
        country_of_origin,
        is_diabetic,
        cardiac_issue,
        blood_pressure,
      },
    } = req;
    const { userid: id, admin: is_admin } = req.user;
    const data = {
      date_of_birth,
      weight,
      height,
      country_of_origin,
      is_diabetic,
      cardiac_issue,
      blood_pressure,
    };

    if (req.user.userid !== id && !is_admin) {
      return res.status(STATUS_CODE.FORBIDDEN).send({
        status: STATUS_CODE.FORBIDDEN,
        message: MESSAGE.FORBIDDEN_MESSAGE,
      });
    }

    if(req.user.userid == id || is_admin){
    const updateInfo = await updatePersonalDetails(data, id);
    
    if (updateInfo.affectedRows === 0) {
      throw {
        STATUS_CODE: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.NOT_UPDATE_MESSAGE,
      };
    }
  }
    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.UPDATE_INFO_SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || STATUS_CODE.SERVER_ERROR).send({
      status: error.status || STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const deletePersonalInfo = async (req, res) => {
  try {
    const { userid: id, admin: is_admin } = req.user;

    if (req.user.userid !== id && !is_admin) {
      return res.status(STATUS_CODE.FORBIDDEN).send({
        status: STATUS_CODE.FORBIDDEN,
        message: MESSAGE.FORBIDDEN_MESSAGE,
      });
    }

    if(req.user.userid == id || is_admin){
    const deleteTask = await deletePersonalDetails(id);

    if (deleteTask.affectedRows === 0) {
      res.status(STATUS_CODE.NOT_FOUND).send({
        status: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.NOT_DELETE_MESSAGE,
      });
    }}
    throw{
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.DELETE_SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error(error.message);

    return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
      status: error.status ||STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *************************************************************************

const addFamilyInfo = async (req, res) => {
  try {
    const {
      body: {
        father_name,
        father_age,
        father_country_origin,
        mother_name,
        mother_age,
        mother_country_origin,
        parent_diabetic,
        parent_cardiac_issue,
        parent_bp,
      },
    } = req;
    const { userid: id, email } = req.user;

    console.log(id);

    const idExists= await checkFamilyInfo(id);
    if (idExists) {
      throw{
        status: STATUS_CODE.INVALID,
        message: MESSAGE.FAMILY_INFO_EXISTS,
      };
    }

    const personalExists = await checkPersonalInfo(id);
    if (!personalExists) {
      throw{ message: "Please fill personal info first." };
    }

    const familyData = {
      father_name,
      father_age,
      father_country_origin,
      mother_name,
      mother_age,
      mother_country_origin,
      parent_diabetic,
      parent_cardiac_issue,
      parent_bp,
    };

    const result = await insertFamilyInfo(familyData, id, email);
    throw{
      status: STATUS_CODE.CREATED,
      message: MESSAGE.ADDED_FAMILY_MESSAGE,
      data: result,
    }
  } catch (error) {
    console.error(error.message);
    return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
      status: error.status ||STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// const getFamilyDetails = async (req, res) => {
//   try {
//     const { userid: id } = req.user;
//     const familyInfo = await getFamilyInfo(id);

//     return res.status( STATUS_CODE.SUCCESS).send({
//       status: STATUS_CODE.SUCCESS,
//       message: MESSAGE.GET_FAMILY_INFO_MESSAGE,
//       data: familyInfo,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(error.status ||STATUS_CODE.ERROR).send({
//       status: error.status ||STATUS_CODE.ERROR,
//       message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
//     });
//   }
// };

const updateFamilyInfoDetails = async (req, res) => {
  try {
    const {
      body: {
        father_name,
        father_age,
        father_country_origin,
        mother_name,
        mother_age,
        mother_country_origin,
        parent_diabetic,
        parent_cardiac_issue,
        parent_bp,
      },
    } = req;
    const { userid: id } = req.user;

    const familyData = {
      father_name,
      father_age,
      father_country_origin,
      mother_name,
      mother_age,
      mother_country_origin,
      parent_diabetic,
      parent_cardiac_issue,
      parent_bp,
    };

    const result = await updateFamilyInfo(familyData, id);

    if (result.affectedRows === 0) {
      throw{
        status: STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.NOT_UPDATE_MESSAGE,
      };
    }

    throw{
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.UPDATE_INFO_SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error(error.message);
    return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
      status: error.status ||STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const deleteFamilyInfoDetails = async (req, res) => {
  try {
    const { userid: id } = req.user;

    const result = await deleteFamilyInfo(id);

    if (result.affectedRows === 0) {
      throw{
        status: STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.NOT_DELETE_MESSAGE,
      };
    }

    throw{
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.DELETE_SUCCESS_MESSAGE,
    };
  } catch (error) {
    console.error(error.message);
    return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
      status:error.status || STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// ********************************************************************

// const getDiseaseDetails = async (req, res) => {
//   try {
//     const { admin: is_admin } = req.user;
//     // const { userid: id } = req.user;
//     const personalInfo = await getDiseaseInfo(is_admin);

//     return res.status(STATUS_CODE.SUCCESS).send({
//       status: STATUS_CODE.SUCCESS,
//       message: MESSAGE.DISEASE_DETAILS,
//       data: personalInfo,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(error.status ||STATUS_CODE.ERROR).send({
//       status: error.status ||STATUS_CODE.ERROR,
//       message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
//     });
//   }
// };

const addDiseaseInfo = async (req, res) => {
  try {
    const {
      body: { disease_type, disease_description },
    } = req;
    const { userid: id } = req.user;

    const idExists= await checkDiseaseInfo(id);
    if (idExists) {
      throw{
        status: STATUS_CODE.INVALID,
        message: MESSAGE.DISEASE_INFO_EXISTS,
      };
    }
    const familyExists = await checkFamilyInfo(id);
    if (!familyExists) {
      throw{ message: MESSAGE.FAMILY_STEP };
    }

    const diseaseData = {
      disease_type,
      disease_description,
    };

    const result = await addDiseaseData(diseaseData, id);
    throw{
      status: STATUS_CODE.CREATED,
      message: MESSAGE.CREATED_DISEASE_INFO_MESSAGE,
      data: result,
    };
  } catch (error) {
    console.error(error.message);
    return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
      status: error.status ||STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const updateDiseaseInfo = async (req, res) => {
  try {
    const {
      body: { disease_type, disease_description },
    } = req;
    const { userid: id } = req.user;

    const formData = { disease_type, disease_description };

    const result = await updateDiseaseDetails(formData, id);

    throw{
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.UPDATE_INFO_SUCCESS_MESSAGE,
      data: result,
    }
  } catch (error) {
    console.error(error.message);
    return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
      status:error.status || STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const deleteDiseaseInfo = async (req, res) => {
  try {
    const { userid: id } = req.user;

    const deleteUser = await deleteDiseaseDetails(id);

    throw{
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.DELETE_SUCCESS_MESSAGE,
      user: deleteUser,
    }
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || STATUS_CODE.SERVER_ERROR).send({
      status: error.status || STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// **************************************************************************

const uploadDocument = async (req, res) => {
  try {

  console.log(" Received File:", req.file);

  if (!req.file) {
    throw {
      status: STATUS_CODE.NOT_FOUND,
      message: MESSAGE.NO_FILE,
    };
  }
  const { userid: id } = req.user;

  const { document_type } = req.body;
  
  const diseaseExists = await checkDiseaseInfo(id);
  if (!diseaseExists) {
    throw{
      message: MESSAGE.DISEASE_STEP,
    };
  }

  if (!document_type || !id) {
    throw {
      status: STATUS_CODE.NOT_FOUND,
      message: MESSAGE.MISSING_REQUIRED,
    };
  }

    const result = await uploadFile(req.file);
    const { secure_url: documentUrl } = result;

    const documentData = {
      document_type,
      document_url: documentUrl,
    };

    await saveDocument(documentData,id);

    return res.status(STATUS_CODE.CREATED).send({
      status: STATUS_CODE.CREATED,
      message: MESSAGE.DOCUMENT_UPLOAD,
      document_url: documentUrl,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || STATUS_CODE.SERVER_ERROR).send({
      status: error.status || STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// ***********************************************************************

export default {
  uploadDocument,
  createPersonalInfo,
  updatePersonalInfo,
  getAllInfo,
  showPatientDetails,
  deletePersonalInfo,
  addFamilyInfo,
  updateFamilyInfoDetails,
  deleteFamilyInfoDetails,
  addDiseaseInfo,
  updateDiseaseInfo,
  deleteDiseaseInfo,
};
