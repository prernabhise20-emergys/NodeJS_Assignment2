import express from "express";
import patientController from "../controllers/patientController.js";
import { schemaValidator } from "../middlewares/userValidation.js";
import { user_schemas } from "../common/constants/schemaConstant.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import {

  upload,
} from "../config/uploadDocument.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";

const router = express.Router();
const {
  ADD_DISEASE,
  GET_FAMILY_INFO,
  GET_PERSONAL_INFO,
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
  GET_UPLOAD_INFO,
  GET_DISEASE_INFO,
} = ROUTE_CONSTANTS;

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
  upload.single('file'),
  patientController.uploadDocument
);
router.put(
  UPDATE_DOCUMENT,
  authenticateUser,
  upload.single('file'),
  patientController.updateDocument
);

router.post(
  ADD_DISEASE,authenticateUser,patientController.addDisease
)

export default router;
