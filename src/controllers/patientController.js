import {
  ERROR_STATUS_CODE,
  SUCCESS_MESSAGE,
  SUCCESS_STATUS_CODE,
  ERROR_MESSAGE
} from "../common/constants/statusConstant.js";
import { uploadFile } from "../common/utility/upload.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import { ResponseHandler } from "../common/utility/handlers.js";

import {
  getDocumentByPatientIdAndType,
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
  checkDocumentExists,
  createDiseaseInformation
} from "../models/patientModel.js";
const {
  DOCUMENT_NOT_FOUND,
  UNAUTHORIZED_ACCESS,
  NOT_DELETED,
  NOT_UPDATE,
  NO_FILE_FOUND,
  MISSING_REQUIRED,
} = AUTH_RESPONSES;


// *****************************************************************

const showPatientDetails = async (req, res, next) => {
  try {
    const { user: { userid: id } } = req;

    const patientInfo = await getPatientInfo(id);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE, patientInfo)
    );
  } catch (error) {
    next(error);
  }
};



// *********************************************************************

const getPersonalDetails = async (req, res, next) => {
  try {
    const { params: { patient_id } } = req;
    const familyInfo = await getPersonalInfo(patient_id);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE, familyInfo)
    );
  } catch (error) {
    next(error);
  }
};


const createPersonalInfo = async (req, res, next) => {
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

    const {user:{ userid: id, email }} = req;
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

    return res.status(SUCCESS_STATUS_CODE.CREATED).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.CREATED,SUCCESS_MESSAGE.ADDED_PERSONAL_INFO_MESSAGE, { patient_id: result.insertId })
    );

  } catch (error) {
    next(error)
  }
};

const updatePersonalInfo = async (req, res, next) => {
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

    const {user:{ userid: id, admin: is_admin }} = req;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);

    if (isValidPatient || is_admin) {
      await updatePersonalDetails(data, patient_id);

      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,SUCCESS_MESSAGE.UPDATE_INFO_SUCCESS_MESSAGE)
      );
    } else {
      throw UNAUTHORIZED_ACCESS;
    }
  } catch (error) {
    next(error)
  }
};

const deletePersonalInfo = async (req, res, next) => {
  try {
    const {user:{ userid: id, admin: is_admin }} = req;
    const {params:{ patient_id } }= req;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await deletePersonalDetails(patient_id);

      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE)
      );
    }
    throw NOT_DELETED;
  } catch (error) {
    next(error)
  }
};

// *************************************************************************

const getFamilyDetails = async (req, res, next) => {
  try {
    const {params:{ patient_id }} = req;
    const familyInfo = await getFamilyInfo(patient_id);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE, familyInfo)
    );
  } catch (error) {
    next(error)
  }
};

const addFamilyInfo = async (req, res, next) => {
  try {
    const {body:{ familyDetails } }= req;

    await insertFamilyInfo(familyDetails);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,SUCCESS_MESSAGE.ADDED_FAMILY_MESSAGE)
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
        mother_diabetic,
        mother_cardiac_issue,
        mother_bp,
        father_diabetic,
        father_cardiac_issue,
        father_bp,
        patient_id,
      },
    } = req;

    mother_diabetic === true || mother_diabetic === 1 ? true : false;
    mother_cardiac_issue === true || mother_cardiac_issue === 1 ? true : false;
    mother_bp === true || mother_bp === 1 ? true : false;
    father_diabetic === true || father_diabetic === 1 ? true : false;
    father_cardiac_issue === true || father_cardiac_issue === 1 ? true : false;
    father_bp === true || father_bp === 1 ? true : false;

    const familyData = {
      father_name,
      father_age,
      father_country_origin,
      mother_name,
      mother_age,
      mother_country_origin,
      mother_diabetic,
      mother_cardiac_issue,
      mother_bp,
      father_diabetic,
      father_cardiac_issue,
      father_bp,
    };
    const { userid: id, admin: is_admin } = req.user;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await updateFamilyInfo(familyData, patient_id);

      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,SUCCESS_MESSAGE.FAMILY_UPDATE_SUCCESSFULLY)
      );
    }
    throw NOT_UPDATE;
  } catch (error) {
    next(error)
  }
};

const deleteFamilyInfoDetails = async (req, res, next) => {
  try {
    const {params:{ patient_id } }= req;
    const {user:{ userid: id, admin: is_admin }} = req;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await deleteFamilyInfo(patient_id);
      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,SUCCESS_MESSAGE.FAMILY_DELETE_SUCCESSFULLY)
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
    const {params:{ patient_id }} = req;
    const personalInfo = await getDiseaseInfo(patient_id);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,SUCCESS_MESSAGE.DISEASE_DETAILS, personalInfo)
    );
  } catch (error) {
    next(error)
  }
};

const addDiseaseInfo = async (req, res, next) => {
  try {
    const {body:{ diseaseDetails }} = req;

    await addDiseaseData(diseaseDetails);

    return res.status(SUCCESS_STATUS_CODE.CREATED).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.CREATED,SUCCESS_MESSAGE.CREATED_DISEASE_INFO_MESSAGE)
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
    const {user:{ userid: id, admin: is_admin }} = req;
    const isValidPatient = await checkUserWithPatientID(id, patient_id);

    const formData = { disease_type, disease_description };
    if (isValidPatient || is_admin) {
      await updateDiseaseDetails(formData, patient_id);

      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,SUCCESS_MESSAGE.DISEASE_UPDATE_SUCCESSFULLY)
      );

    }
    throw NOT_UPDATE;
  } catch (error) {
    next(error)
  }
};

const deleteDiseaseInfo = async (req, res, next) => {
  try {
    const {params:{ patient_id }} = req;
    const {user:{ userid: id, admin: is_admin }} = req;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await deleteDiseaseDetails(patient_id);

      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,SUCCESS_MESSAGE.DISEASE_DELETE_SUCCESSFULLY)
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
    const {params:{ patient_id }} = req;

    const personalInfo = await getUploadInfo(patient_id);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS,SUCCESS_MESSAGE.RETRIEVE_INFO_SUCCESS_MESSAGE, personalInfo)
    );

  } catch (error) {
    next(error)
  }
};

const uploadDocument = async (req, res, next) => {
  try {

    if (!req.file) {
      throw NO_FILE_FOUND;
    }

    const {body:{ document_type, patient_id }} = req;

    if (!document_type || !patient_id) {
      throw MISSING_REQUIRED;
    }

    const result = await uploadFile(req.file);
    const { secure_url: documentUrl } = result;

    const documentPath = documentUrl.split("raw/upload/")[1];

    const documentData = {
      document_type,
      document_url: documentPath,
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

    return res.status(SUCCESS_STATUS_CODE.CREATED).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.CREATED,SUCCESS_MESSAGE.DOCUMENT_UPLOAD, documentPath)
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
    const {body:{ document_type, patient_id }} = req;
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
    const documentPath = documentUrl.split("raw/upload/")[1];

    const data = {
      document_type,
      document_url: documentPath,
      patient_id,
    };
    const {user:{ userid: id, admin: is_admin }} = req;

    const isValidPatient = await checkUserWithPatientID(id, patient_id);
    if (isValidPatient || is_admin) {
      await modifyDocument(data);

      return res.status(SUCCESS_STATUS_CODE.CREATED).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.CREATED,SUCCESS_MESSAGE.DOCUMENT_UPDATE_SUCCESSFULLY)
      );
    }
    throw NOT_UPDATE;
  } catch (error) {
    next(error)
  }
};

import cloudinaryBaseUrl from '../common/constants/pathConstant.js'

const downloadDocument = async (req, res, next) => {
  try {

    const {query:{ patient_id }} = req;
    const {body:{ document_type }} = req;

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

    const documentUrl = cloudinaryBaseUrl + document.document_url;

    return res.redirect(documentUrl);

  } catch (error) {

    next(error)
  }
};

// const addDisease = async (req, res, next) => {
//   try {
//     const { patient_id } = req.query;
//     const { disease_type, disease_description } = req.body;

//     const data = { disease_type, disease_description, patient_id };

//     await createDiseaseInformation(data);

//     return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
//       new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.CREATED_DISEASE_INFO_MESSAGE)
//     );
//   } catch (error) {
//     next(error); 
//   }
// };

const addDisease = async (req, res, next) => {
  try {
    const { patient_id } = req.query;
    const { disease_type, disease_description } = req.body;

    // Prepare data to insert into the disease table
    const data = { disease_type, disease_description, patient_id };

    await createDiseaseInformation(data);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
      new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.CREATED_DISEASE_INFO_MESSAGE)
    );
  } catch (error) {
    next(error); 
  }
};



export default{
addDisease,
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
};
