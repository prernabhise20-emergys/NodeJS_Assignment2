import express from "express";
import doctorController from "../controllers/doctorController.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";
import {
  upload,
} from "../config/uploadDocument.js";
const router = express.Router();

const {
  ADD_PRISCRIPTION,
  DISPLAY_APPOINTMENTS,
  UPDATE_DOCTOR
} = ROUTE_CONSTANTS;


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

export default router;
