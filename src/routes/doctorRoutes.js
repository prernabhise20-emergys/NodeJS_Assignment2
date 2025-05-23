import express from "express";
import doctorController from "../controllers/doctorController.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";
import {
  upload,
} from "../config/uploadDocument.js";
const router = express.Router();

const {
  APPROVE_LEAVE,
  DISPLAY_LEAVE_REQUEST,
  APPLY_LEAVE,
  GET_OBSERVATION,
  DELETE_OBSERVATION,
  EDIT_OBSERVATION,
  ADD_OBSERVATION,
  CHANGE_AVAILABILITY_STATUS,
  UPDATE_PRISCRIPTION,
  ADD_PRISCRIPTION,
  DISPLAY_APPOINTMENTS,
  UPDATE_DOCTOR,
  GET_DOCTOR_PROFILE
} = ROUTE_CONSTANTS;

router.get(GET_DOCTOR_PROFILE,authenticateUser,doctorController.getDoctorProfile)
router.put(
  UPDATE_DOCTOR,
  authenticateUser,
  doctorController.updateDoctor
);
        

router.get(
  DISPLAY_APPOINTMENTS,
  authenticateUser,
  doctorController.displayAppointments
)


router.post(
  ADD_PRISCRIPTION,
  authenticateUser,
  upload.single('file'),
  doctorController.uploadPrescription
)


router.put(
  UPDATE_PRISCRIPTION,
  authenticateUser,
  upload.single('file'),
  doctorController.updateExistsPrescription
)

router.put(CHANGE_AVAILABILITY_STATUS,authenticateUser,doctorController.changeDoctorAvailabilityStatus);
router.post(ADD_OBSERVATION,authenticateUser,doctorController.addObservation)
router.put(EDIT_OBSERVATION,authenticateUser,doctorController.editObservation)
router.delete(DELETE_OBSERVATION,authenticateUser,doctorController.deleteObservation)
router.get(GET_OBSERVATION,authenticateUser,doctorController.getObservation)
router.post(APPLY_LEAVE,authenticateUser,doctorController.applyLeave)
router.get(DISPLAY_LEAVE_REQUEST,authenticateUser,doctorController.showLeaveRequest)
router.put(APPROVE_LEAVE,authenticateUser,doctorController.approveLeave)
export default router;
