import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  ERROR_STATUS_CODE,
  SUCCESS_STATUS_CODE,
} from "../common/constants/statusConstant.js";
import { uploadFile } from "../common/utility/upload.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";

import {
  convertToBoolean,
  getFamilyInfo,
  getUploadInfo,
  createPersonalDetails,
  getPersonalInfo,
  updatePersonalDetails,
  getInfo,
  deletePersonalDetails,
  getDiseaseInfo,
  addDiseaseData,
  insertFamilyInfo,
  getPatientInfo,
  updateFamilyInfo,
  deleteFamilyInfo,
  updateDiseaseDetails,
  deleteDiseaseDetails,
  saveDocument,
  modifyDocument,
  removeDocument,
  checkDocumentExists,
  checkPersonalInfo,
  checkFamilyInfo,
  checkDiseaseInfo,
} from "../models/patientModel.js";
const {
  DOCUMENT_NOT_FOUND,
  UNAUTHORIZED_ACCESS,
  FORBIDDEN,
  UPDATE_SUCCESSFULLY,
  NOT_DELETED,
  DELETE_SUCCESSFULLY,
  ADD_FAMILY_SUCCESSFULLY,
  NOT_UPDATE,
  ADD_DISEASE_INFO,
  NO_FILE_FOUND,
  MISSING_REQUIRED,
} = AUTH_RESPONSES;

const getAllInfo = async (req, res) => {
  try {
    const { admin: is_admin } = req.user;

    if (!is_admin) {
      throw UNAUTHORIZED_ACCESS;
    }

    let { page = 1, limit = 10, patient_id } = req.body;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const offset = (page - 1) * limit;

    const personalInfo = await getInfo(is_admin, limit, offset, patient_id);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
      data: personalInfo,
      pagination: {
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *****************************************************************

const showPatientDetails = async (req, res) => {
  try {
    const { userid: id } = req.user;

    const patientInfo = await getPatientInfo(id);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
      data: patientInfo,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *********************************************************************
const getPersonalDetails = async (req, res) => {
  try {
    const {patient_id}=req.params;
    const familyInfo = await getPersonalInfo(patient_id);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
      data: familyInfo,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message ||ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const createPersonalInfo = async (req, res) => {
  try {
    const {
      body: {
        patient_name,
        date_of_birth,
        gender,
        weight,
        height,
        country_of_origin,
        is_diabetic,
        cardiac_issue,
        blood_pressure,
      },
    } = req;

    const { userid: id, email } = req.user;
    const data = {
      patient_name,
      date_of_birth,
      gender,
      weight,
      height,
      country_of_origin,
      is_diabetic,
      cardiac_issue,
      blood_pressure,
    };

    const result = await createPersonalDetails(data, id, email);

    return res.status(SUCCESS_STATUS_CODE.CREATED).send({
      status: SUCCESS_STATUS_CODE.CREATED,
      message: SUCCESS_MESSAGE.ADDED_PERSONAL_INFO_MESSAGE,
      data: {
        patient_id: result.insertId,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const updatePersonalInfo = async (req, res) => {
  try {
    const {
      body: {
        patient_name,
        date_of_birth,
        gender,
        weight,
        height,
        country_of_origin,
        is_diabetic,
        cardiac_issue,
        blood_pressure,
        patient_id
      },
    } = req;

    const data = {
      patient_name,
      date_of_birth,
      gender,
      weight,
      height,
      country_of_origin,
      is_diabetic,
      cardiac_issue,
      blood_pressure,
    };
    
    const { userid: id , admin: is_admin} = req.user;

    // if (req.user.userid == id || is_admin) {
      await updatePersonalDetails(data, patient_id);
    // }

    throw UPDATE_SUCCESSFULLY;

  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// const updatePersonalInfo = async (req, res) => {
//   try {
//     const {
//       body: {
//         patient_name,
//         date_of_birth,
//         gender,
//         weight,
//         height,
//         country_of_origin,
//         is_diabetic,
//         cardiac_issue,
//         blood_pressure,
//         patient_id
//       },
//     } = req;

//     const data = {
//       patient_name,
//       date_of_birth,
//       gender,
//       weight,
//       height,
//       country_of_origin,
//       is_diabetic: convertToBoolean(is_diabetic),
//       cardiac_issue: convertToBoolean(cardiac_issue),
//       blood_pressure: convertToBoolean(blood_pressure),
//     };

//     const { userid: id, admin: is_admin } = req.user;

//     // if (req.user.userid == id || is_admin) {
//       await updatePersonalDetails(data, patient_id);
//     // }

//     throw UPDATE_SUCCESSFULLY;

//   } catch (error) {
//     console.error(error.message);
//     return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
//       status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
//       message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
//     });
//   }
// };


const deletePersonalInfo = async (req, res) => {
  try {
    const { userid: id, admin: is_admin } = req.user;
    const { patient_id } = req.params;

    // if (req.user.userid !== id && !is_admin) {
    //   throw INVALID_USER;
    // }

    // if (req.user.userid == id || is_admin) {
      const deleteTask = await deletePersonalDetails(patient_id);

      if (deleteTask.affectedRows === 0) {
        throw NOT_DELETED;
      }
    // }
    throw DELETE_SUCCESSFULLY;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *************************************************************************
const getFamilyDetails = async (req, res) => {
  try {
    const {patient_id}=req.params;
    const familyInfo = await getFamilyInfo(patient_id);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
      data: familyInfo,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message ||ERROR_MESSAGE.SERVER_ERROR_MESSAGE
    });
  }
};
const addFamilyInfo = async (req, res) => {
  try {
    const { familyDetails } = req.body;
    const { patient_id } = familyDetails;
    console.log("Patient ID:", patient_id);

    const result = await insertFamilyInfo(familyDetails);
    throw ADD_FAMILY_SUCCESSFULLY;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

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
        patient_id,
      },
    } = req;

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
    const { userid: id, admin: is_admin } = req.user;

    // if (req.user.userid !== id && !is_admin) {
    //   throw INVALID_USER;
    // }

    // if (req.user.userid == id || is_admin){
    const result = await updateFamilyInfo(familyData, patient_id);
    
    if (result.affectedRows === 0) {
      throw NOT_UPDATE;
    }
  // }
    throw UPDATE_SUCCESSFULLY;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const deleteFamilyInfoDetails = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { userid: id, admin: is_admin } = req.user;

    // if (req.user.userid !== id && !is_admin) {
    //   throw INVALID_USER;
    // }

    // if (req.user.userid == id || is_admin){
    const result = await deleteFamilyInfo(patient_id);

    if (result.affectedRows === 0) {
      throw NOT_DELETED;
    }
  // }
    throw DELETE_SUCCESSFULLY;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// ********************************************************************

const getDiseaseDetails = async (req, res) => {
  try {
    const { patient_id } = req.params; 
    const personalInfo = await getDiseaseInfo( patient_id);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.DISEASE_DETAILS,
      data: personalInfo,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const addDiseaseInfo = async (req, res) => {
  try {
    const { diseaseDetails } = req.body;

     await addDiseaseData(diseaseDetails);
    throw ADD_DISEASE_INFO;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const updateDiseaseInfo = async (req, res) => {
  try {
    const {
      body: { disease_type, disease_description, patient_id },
    } = req;
    const { userid: id, admin: is_admin } = req.user;

    // if (req.user.userid !== id && !is_admin) {
    //   throw INVALID_USER;
    // }

    const formData = { disease_type, disease_description };
    
    // if (req.user.userid == id || is_admin){
     await updateDiseaseDetails(formData, patient_id);
    // }
    throw UPDATE_SUCCESSFULLY;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const deleteDiseaseInfo = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { userid: id, admin: is_admin } = req.user;

    // if (req.user.userid !== id && !is_admin) {
    //   throw INVALID_USER;
    // }

    // if (req.user.userid == id || is_admin){
     await deleteDiseaseDetails(patient_id);
    // }
    throw DELETE_SUCCESSFULLY;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// **************************************************************************
const getUploadDocument = async (req, res) => {
  try {
    const { patient_id } = req.params; 
    const personalInfo = await getUploadInfo( patient_id);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
      data: personalInfo,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const uploadDocument = async (req, res) => {
  try {

  console.log(" Received File:", req.file);

  if (!req.file) {
    throw {
      status: ERROR_STATUS_CODE.NOT_FOUND,
      message: ERROR_MESSAGE.NO_FILE,
    };
  }

  const { document_type,patient_id } = req.body;
  

  if (!document_type || !patient_id) {
    throw MISSING_REQUIRED;
  }

    const result = await uploadFile(req.file);
    const { secure_url: documentUrl } = result;

    const documentData = {
      document_type,
      document_url: documentUrl,
      patient_id
    };

    await saveDocument(documentData);

    return res.status(SUCCESS_STATUS_CODE.CREATED).send({
      status: SUCCESS_STATUS_CODE.CREATED,
      message: SUCCESS_MESSAGE.DOCUMENT_UPLOAD,
      document_url: documentUrl,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const updateDocument = async (req, res) => {
  try {
    if (!req.file) {
      throw NO_FILE_FOUND;
    }
    const { document_type, patient_id } = req.body;
    if (!document_type || !patient_id) {
      throw MISSING_REQUIRED;
    }

    const documentExists = await checkDocumentExists(document_type, patient_id);
    if (!documentExists) {
      throw DOCUMENT_NOT_FOUND;
    }

    let documentUrl;
    if (req.file) {
      const result = await uploadFile(req.file);
      documentUrl = result.secure_url;
    }

    const data = {
      document_type,
      document_url: documentUrl,
      patient_id,
    };
    console.log(document_type, documentUrl, patient_id);

    await modifyDocument(data);

   throw UPDATE_SUCCESSFULLY;

  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const{patient_id,document_type}=req.body;
    const { userid: id, admin: is_admin } = req.user;

    // if (req.user.userid !== id && !is_admin) {
    //   throw INVALID_USER;
    // }

  
    const documentExists = await checkDocumentExists(document_type, patient_id);
    if (!documentExists) {
      throw DOCUMENT_NOT_FOUND;
    }
    // if (req.user.userid == id || is_admin){
    await removeDocument(patient_id,document_type);

    throw DELETE_SUCCESSFULLY;
  // }
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

export default {
  getUploadDocument,
  getPersonalDetails,
  getFamilyDetails,
  getDiseaseDetails,
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
  updateDocument,
  deleteDocument
};
