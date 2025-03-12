import express from 'express';
import patientController from '../controllers/patientController.js';  
import { schemaValidator } from '../middlewares/userValidation.js';
import { user_schemas } from '../common/constants/schemaConstant.js';
import authenticateUser  from '../middlewares/authMiddleware.js';
import { upload } from '../config/uploadDocument.js';
const router = express.Router();

router.get('/getInfo', authenticateUser, patientController.getAllInfo);
router.post('/personalInfo',authenticateUser, schemaValidator(user_schemas.createPersonalInfo), patientController.createPersonalInfo);
router.put('/updatePersonalInfo',authenticateUser,schemaValidator(user_schemas.updatePersonalInfo), patientController.updatePersonalInfo);
router.delete('/deleteInfo', authenticateUser, patientController.deletePersonalInfo);

router.post('/familyInfo', authenticateUser, schemaValidator(user_schemas.createFamilyInfo), patientController.addFamilyInfo);
router.get('/getFamilyInfo', authenticateUser, patientController.getFamilyDetails);
router.put('/updateFamilyInfo', authenticateUser, schemaValidator(user_schemas.updateFamilyInfo), patientController.updateFamilyInfoDetails);
router.delete('/deleteFamilyInfo', authenticateUser, patientController.deleteFamilyInfoDetails);

router.get('/getDiseaseInfo', authenticateUser, patientController.getDiseaseDetails);
router.post('/diseaseInfo', authenticateUser, schemaValidator(user_schemas.createDiseaseInfo), patientController.addDiseaseInfo);
router.put('/updateDiseaseInfo', authenticateUser, schemaValidator(user_schemas.updateDiseaseInfo), patientController.updateDiseaseInfo);
router.delete('/deleteDiseaseInfo', authenticateUser, patientController.deleteDiseaseInfo);


router.post('/upload', authenticateUser, upload.single('file'), patientController.uploadDocument);


export default router;
