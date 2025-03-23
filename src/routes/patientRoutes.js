import express from "express";
import patientController from "../controllers/patientController.js";
import { schemaValidator } from "../middlewares/userValidation.js";
import { user_schemas } from "../common/constants/schemaConstant.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import {
  uploadMultiple,
  uploadSingle,
  upload,
} from "../config/uploadDocument.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";
import { removeDocument } from "../models/patientModel.js";

const router = express.Router();
const {
  GET_FAMILY_INFO,
  GET_PERSONAL_INFO,
  GET_ALL_PATIENT_DETAILS,
  ADD_PERSONAL_DATA,
  UPDATE_PERSONAL_DATA,
  DELETE_PERSONAL_DATA,
  ADD_FAMILY_DATA,
  GET_PATIENT_INFO,
  UPDATE_FAMILY_INFO,
  DELETE_FAMILY_INFO,
  ADD_DISEASE_INFO,
  UPDATE_DISEASE_INFO,
  DELETE_DISEASE_INFO,
  UPLOAD_DOCUMENTS,
  UPDATE_DOCUMENT,
  DELETE_DOCUMENT,
  GET_UPLOAD_INFO,
  GET_DISEASE_INFO,
} = ROUTE_CONSTANTS;

router.get(
  GET_ALL_PATIENT_DETAILS,
  authenticateUser,
  patientController.getAllInfo
);
router.get(
  GET_PERSONAL_INFO,
  authenticateUser,
  patientController.getPersonalDetails
);

router.post(
  ADD_PERSONAL_DATA,
  authenticateUser,
  schemaValidator(user_schemas.createPersonalInfo),
  patientController.createPersonalInfo
);
router.put(
  UPDATE_PERSONAL_DATA,
  authenticateUser,
  schemaValidator(user_schemas.updatePersonalInfo),
  patientController.updatePersonalInfo
);
router.delete(
  DELETE_PERSONAL_DATA,
  authenticateUser,
  patientController.deletePersonalInfo
);
router.get(
  GET_FAMILY_INFO,
  authenticateUser,
  patientController.getFamilyDetails
);
router.post(
  ADD_FAMILY_DATA,
  authenticateUser,
  schemaValidator(user_schemas.createFamilyInfo),
  patientController.addFamilyInfo
);
router.get(
  GET_PATIENT_INFO,
  authenticateUser,
  patientController.showPatientDetails
);
router.put(
  UPDATE_FAMILY_INFO,
  authenticateUser,
  schemaValidator(user_schemas.updateFamilyInfo),
  patientController.updateFamilyInfoDetails
);
router.delete(
  DELETE_FAMILY_INFO,
  authenticateUser,
  patientController.deleteFamilyInfoDetails
);
router.get(
  GET_DISEASE_INFO,
  authenticateUser,
  patientController.getDiseaseDetails
);

router.post(
  ADD_DISEASE_INFO,
  authenticateUser,
  schemaValidator(user_schemas.createDiseaseInfo),
  patientController.addDiseaseInfo
);
router.put(
  UPDATE_DISEASE_INFO,
  authenticateUser,
  schemaValidator(user_schemas.updateDiseaseInfo),
  patientController.updateDiseaseInfo
);
router.delete(
  DELETE_DISEASE_INFO,
  authenticateUser,
  patientController.deleteDiseaseInfo
);
router.get(
  GET_UPLOAD_INFO,
  authenticateUser,
  patientController.getUploadDocument
);

router.post(
  UPLOAD_DOCUMENTS,
  authenticateUser,
  uploadMultiple,
  patientController.uploadDocument
);
router.put(
  UPDATE_DOCUMENT,
  authenticateUser,
  uploadSingle,
  patientController.updateDocument
);

router.delete(
  DELETE_DOCUMENT,
  authenticateUser,
  upload.none(),
  patientController.deleteDocument
);

export default router;
