import express from "express";
import doctorController from "../controllers/doctorController.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";
import { schemaValidator } from "../middlewares/userValidation.js";
import { user_schemas } from "../common/constants/schemaConstant.js";
const router = express.Router();

const {
    CHANGE_STATUS,
    DISPLAY_APPOINTMENTS,
    UPDATE_DOCTOR
} = ROUTE_CONSTANTS;

router.put(UPDATE_DOCTOR,authenticateUser,doctorController.updateDoctor)
router.get(DISPLAY_APPOINTMENTS,authenticateUser,doctorController.displayAppointments)
router.put(CHANGE_STATUS,authenticateUser,schemaValidator(user_schemas.changeStatus),doctorController.changeAppointmentsStatus)
export default router;
