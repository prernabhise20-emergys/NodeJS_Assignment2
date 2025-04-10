import express from "express";
import adminController from "../controllers/adminController.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";
import { schemaValidator } from "../middlewares/userValidation.js";
import { user_schemas } from "../common/constants/schemaConstant.js"
const router = express.Router();

const {
  SHOW_AVAILABILITY,
  APPOINTMENT_REQUEST,
  APPROVE_APPOINTMENT,
  CHANGE_STATUS,
  DELETE_DOCTOR,
  ADD_DOCTOR,
  GET_AGE_GROUP,
  ADMIN_DELETE_PATIENT_DATA,
  GET_ALL_PATIENT_DETAILS,
  ADD_ADMIN,
  REMOVE_ADMIN,
  GET_ADMIN,
} = ROUTE_CONSTANTS;


router.get(
  GET_ALL_PATIENT_DETAILS,
  authenticateUser,
  adminController.getAllInfo
);

router.delete(
  ADMIN_DELETE_PATIENT_DATA,
  authenticateUser,
  adminController.adminDeletePatientData
);

router.get(GET_AGE_GROUP, authenticateUser, adminController.ageGroupData);
router.put(ADD_ADMIN, authenticateUser, adminController.addAdmin);
router.put(REMOVE_ADMIN, authenticateUser, adminController.removeAdmin);
router.get(GET_ADMIN, adminController.getAdmin);
router.post(ADD_DOCTOR,authenticateUser,adminController.addDoctor)
router.delete(DELETE_DOCTOR,authenticateUser,adminController.deleteDoctor);
router.put(CHANGE_STATUS,authenticateUser,schemaValidator(user_schemas.changeStatus),adminController.changeAppointmentsStatus)
router.put(APPROVE_APPOINTMENT,authenticateUser,schemaValidator(user_schemas.changeStatus),adminController.approveAppointment)
router.get(APPOINTMENT_REQUEST, authenticateUser, adminController.displayAppointmentRequest);
router.get(SHOW_AVAILABILITY,authenticateUser,adminController.getDoctorAvailability)
export default router;
