import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  ERROR_STATUS_CODE,
  SUCCESS_STATUS_CODE,
} from "../common/constants/statusConstant.js";
import { uploadFile } from "../common/utility/upload.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";

import {
  ageGroupWiseData,
  checkNumberOfDocument,
  deletePatientDetails,
  checkUserWithPatientID,
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
  getTotalCount,
  getDocumentByPatientIdAndType,
} from "../models/patientModel.js";
const {
  FAMILY_DELETE_SUCCESSFULLY,
  PERSONAL_DELETE_SUCCESSFULLY,
    UPDATE_SUCCESSFULLY,
  MORE_THAN_LIMIT,
  DOCUMENT_NOT_FOUND,
  UNAUTHORIZED_ACCESS,
  PERSONAL_UPDATE_SUCCESSFULLY,
  NOT_DELETED,
  DELETE_SUCCESSFULLY,
  ADD_FAMILY_SUCCESSFULLY,
  NOT_UPDATE,
  ADD_DISEASE_INFO,
  NO_FILE_FOUND,
  MISSING_REQUIRED,
  FAMILY_UPDATE_SUCCESSFULLY,
  DISEASE_UPDATE_SUCCESSFULLY,
  DISEASE_DELETE_SUCCESSFULLY,
  DOCUMENT_UPDATE_SUCCESSFULLY,
  DOCUMENT_DELETE_SUCCESSFULLY
} = AUTH_RESPONSES;

const getAllInfo = async (req, res) => {
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
    const { patient_id } = req.params;
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
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
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
        is_diabetic: diabetic,
        cardiac_issue: cardiac,
        blood_pressure: pressure,
        patient_id,
      },
    } = req;

    const is_diabetic = diabetic === true || diabetic === 1;
    const cardiac_issue = cardiac === true || cardiac === 1;
    const blood_pressure = pressure === true || pressure === 1;

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

    const { userid: id, admin: is_admin } = req.user;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);

    if (isValidPatient || is_admin) {
      await updatePersonalDetails(data, patient_id);
      throw  PERSONAL_UPDATE_SUCCESSFULLY;
    } else {
      throw UNAUTHORIZED_ACCESS;
    }
  } catch (error) {
    // throw INTERNAL_SERVER_ERROR;
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const deletePersonalInfo = async (req, res) => {
  try {
    const { userid: id, admin: is_admin } = req.user;
    const { patient_id } = req.params;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await deletePersonalDetails(patient_id);
      throw PERSONAL_DELETE_SUCCESSFULLY;
    }
    throw NOT_DELETED;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};
const adminDeletePatientData = async (req, res) => {
  try {
    const { admin: is_admin } = req.user;
    const { patient_id } = req.query;
    console.log(patient_id);

    if (is_admin) {
      await deletePatientDetails(patient_id);
      throw DELETE_SUCCESSFULLY;
    }
    throw NOT_DELETED;
  } catch (error) {
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};
// *************************************************************************
const getFamilyDetails = async (req, res) => {
  try {
    const { patient_id } = req.params;
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
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
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

    parent_diabetic === true || parent_diabetic === 1 ? true : false;
    parent_cardiac_issue === true || parent_cardiac_issue === 1 ? true : false;
    parent_bp === true || parent_bp === 1 ? true : false;

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

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await updateFamilyInfo(familyData, patient_id);
      throw FAMILY_UPDATE_SUCCESSFULLY;
    }
    throw NOT_UPDATE;
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

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await deleteFamilyInfo(patient_id);
      throw FAMILY_DELETE_SUCCESSFULLY;
    }
    throw NOT_DELETED;
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
    const personalInfo = await getDiseaseInfo(patient_id);

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
    const isValidPatient = await checkUserWithPatientID(id, patient_id);

    const formData = { disease_type, disease_description };
    if (isValidPatient || is_admin) {
      await updateDiseaseDetails(formData, patient_id);
      throw DISEASE_UPDATE_SUCCESSFULLY;
    }
    throw NOT_UPDATE;
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

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await deleteDiseaseDetails(patient_id);
      throw DISEASE_DELETE_SUCCESSFULLY;
    }
    throw NOT_DELETED;
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
    const personalInfo = await getUploadInfo(patient_id);

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
      throw NO_FILE_FOUND;
    }

    const { document_type, patient_id } = req.body;

    if (!document_type || !patient_id) {
      throw MISSING_REQUIRED;
    }

    const moreThanLimit = await checkNumberOfDocument(patient_id);
    if (moreThanLimit) {
      throw MORE_THAN_LIMIT;
    }
    const result = await uploadFile(req.file);
    const { secure_url: documentUrl } = result;

    const documentData = {
      document_type,
      document_url: documentUrl,
      patient_id,
    };

    // const documentUrls = [];

    // for (const file of req.files) {
    //   const result = await uploadFile(file);

    //   const { secure_url: documentUrl } = result;

    //   documentUrls.push(documentUrl);

    //   const documentData = {
    //     document_type,
    //     document_url: documentUrl,
    //     patient_id: patient_id,
    //   };
    // }
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
    const { userid: id, admin: is_admin } = req.user;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await modifyDocument(data);
      throw DOCUMENT_UPDATE_SUCCESSFULLY;
    }
    throw NOT_UPDATE;
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
    const { patient_id, document_type } = req.body;
    const { userid: id, admin: is_admin } = req.user;

    const documentExists = await checkDocumentExists(document_type, patient_id);
    if (!documentExists) {
      throw DOCUMENT_NOT_FOUND;
    }
    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await removeDocument(patient_id, document_type);
      throw DOCUMENT_DELETE_SUCCESSFULLY;
    }
    throw NOT_DELETED;
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const ageGroupData = async (req, res) => {
  try {
    const { admin: is_admin } = req.user;

    const ageGroup = await ageGroupWiseData(is_admin);

    const ageData = {
      Child: ageGroup.find((group) => group.ageGroup === "child")?.count || 0,
      Teen: ageGroup.find((group) => group.ageGroup === "teen")?.count || 0,
      Adults: ageGroup.find((group) => group.ageGroup === "adult")?.count || 0,
      Older: ageGroup.find((group) => group.ageGroup === "older")?.count || 0,
    };

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,
      data: ageData,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { patient_id, document_type } = req.query;

    if (!patient_id || !document_type) {
      throw MISSING_REQUIRED;
    }

    const document = await getDocumentByPatientIdAndType(
      patient_id,
      document_type
    );

    if (!document) {
      throw DOCUMENT_NOT_FOUND;
    }

    const documentUrl = document.document_url;

    return res.redirect(documentUrl);
    
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

export default {
  downloadDocument,
  ageGroupData,
  adminDeletePatientData,
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
  deleteDocument,
};
