import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  ERROR_STATUS_CODE,
  SUCCESS_STATUS_CODE,
} from "../common/constants/statusConstant.js";
import { uploadFile } from "../common/utility/upload.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import { ResponseHandler } from "../common/utility/handlers.js";

import {
  checkNumberOfDocument,
  checkUserWithPatientID,
  getFamilyInfo,
  getUploadInfo,
  createPersonalDetails,
  getPersonalInfo,
  updatePersonalDetails,
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
  getDocumentByPatientIdAndType,
} from "../models/patientModel.js";
const {
  MORE_THAN_LIMIT,
  DOCUMENT_NOT_FOUND,
  UNAUTHORIZED_ACCESS,
  NOT_DELETED,
  NOT_UPDATE,
  NO_FILE_FOUND,
  MISSING_REQUIRED,
} = AUTH_RESPONSES;

const showPatientDetails = async (req, res,next) => {
  try {
    const { userid: id } = req.user;

    const patientInfo = await getPatientInfo(id);
  res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,patientInfo)
      );

  } catch (error) {
    next(error)
  }
};

// *********************************************************************
const getPersonalDetails = async (req, res,next) => {
  try {
    const { patient_id } = req.params;
    const familyInfo = await getPersonalInfo(patient_id);

    res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,familyInfo)
    );
    
  } catch (error) {
    next(error);
  }
};

const createPersonalInfo = async (req, res,next) => {
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

    res.status(SUCCESS_STATUS_CODE.CREATED).send(
      new ResponseHandler(SUCCESS_MESSAGE.ADDED_PERSONAL_INFO_MESSAGE,{patient_id:result.insertId})
    );
  } catch (error) {
    next(error)
  }
};

const updatePersonalInfo = async (req, res,next) => {
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

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.PERSONAL_UPDATE)
      );
    } else {
      throw UNAUTHORIZED_ACCESS;
    }
  } catch (error) {
    next(error)
  }
};

const deletePersonalInfo = async (req, res,next) => {
  try {
    const { userid: id, admin: is_admin } = req.user;
    const { patient_id } = req.params;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await deletePersonalDetails(patient_id);

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.PERSONAL_DELETE_SUCCESSFULLY)
      );
    }
    throw NOT_DELETED;
  } catch (error) {
    next(error)
  }
};

// *************************************************************************
const getFamilyDetails = async (req, res,next) => {
  try {
    const { patient_id } = req.params;
    const familyInfo = await getFamilyInfo(patient_id);

    res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,familyInfo)
    );
    
  } catch (error) {
    next(error)
  }
};
const addFamilyInfo = async (req, res,next) => {
  try {
    const { familyDetails } = req.body;
    const { patient_id } = familyDetails;
    console.log("Patient ID:", patient_id);

    await insertFamilyInfo(familyDetails);
    res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_MESSAGE.ADDED_FAMILY_MESSAGE)
    );
  } catch (error) {
    next(error)
  }
};

const updateFamilyInfoDetails = async (req, res, next) => {
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

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.FAMILY_UPDATE_SUCCESSFULLY)
      );
    }
    throw NOT_UPDATE;
  } catch (error) {
    next(error)
  }
};

const deleteFamilyInfoDetails = async (req, res, next) => {
  try {
    const { patient_id } = req.params;
    const { userid: id, admin: is_admin } = req.user;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await deleteFamilyInfo(patient_id);

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.FAMILY_DELETE_SUCCESSFULLY)
      );
    }
    throw NOT_DELETED;
  } catch (error) {
    next(error)
  }
};

// ********************************************************************

const getDiseaseDetails = async (req, res, next) => {
  try {
    const { patient_id } = req.params;
    const personalInfo = await getDiseaseInfo(patient_id);

    res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_MESSAGE.DISEASE_DETAILS,personalInfo)
    );
  } catch (error) {
   next(error)
  }
};

const addDiseaseInfo = async (req, res, next) => {
  try {
    const { diseaseDetails } = req.body;

    await addDiseaseData(diseaseDetails);

    res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_MESSAGE.CREATED_DISEASE_INFO_MESSAGE)
    );

  } catch (error) {
   next(error)
  }
};

const updateDiseaseInfo = async (req, res, next) => {
  try {
    const {
      body: { disease_type, disease_description, patient_id },
    } = req;
    const { userid: id, admin: is_admin } = req.user;
    const isValidPatient = await checkUserWithPatientID(id, patient_id);

    const formData = { disease_type, disease_description };
    if (isValidPatient || is_admin) {
      await updateDiseaseDetails(formData, patient_id);

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.DISEASE_UPDATE_SUCCESSFULLY)
      );
    }
    throw NOT_UPDATE;
  } catch (error) {
   next(error)
  }
};

const deleteDiseaseInfo = async (req, res, next) => {
  try {
    const { patient_id } = req.params;
    const { userid: id, admin: is_admin } = req.user;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await deleteDiseaseDetails(patient_id);

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.DISEASE_DELETE_SUCCESSFULLY)
      );
    }
    throw NOT_DELETED;
  } catch (error) {
    next(error)
  }
};

// **************************************************************************
const getUploadDocument = async (req, res, next) => {
  try {
    const { patient_id } = req.params;

    const personalInfo = await getUploadInfo(patient_id);
    res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE,personalInfo)
    );
  } catch (error) {
   next(error)
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    console.log("Received File:", req.file);

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

    const documentPath = documentUrl.split("raw/upload/")[1];

    const documentData = {
      document_type,
      document_url: documentPath,
      patient_id,
    };

    await saveDocument(documentData);

    res.status(SUCCESS_STATUS_CODE.CREATED).send(
      new ResponseHandler(SUCCESS_MESSAGE.DOCUMENT_UPLOAD,documentPath)
    );
  } catch (error) {
   next(error)
  }
};

const updateDocument = async (req, res, next) => {
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

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.DOCUMENT_UPDATE_SUCCESSFULLY)
      );
   
    }
    throw NOT_UPDATE;
  } catch (error) {
    next(error)
  }
};

const deleteDocument = async (req, res, next) => {
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

      res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_MESSAGE.DOCUMENT_DELETE_SUCCESSFULLY)
      );
     
    }
    throw NOT_DELETED;
  } catch (error) {
   next(error)
  }
};

const downloadDocument = async (req, res, next) => {
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
    next(error)
  }
};

export default {
  downloadDocument,
  getUploadDocument,
  getPersonalDetails,
  getFamilyDetails,
  getDiseaseDetails,
  uploadDocument,
  createPersonalInfo,
  updatePersonalInfo,
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
