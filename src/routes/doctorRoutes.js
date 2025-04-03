import express from "express";
import doctorController from "../controllers/doctorController.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";

const router = express.Router();

const {
    SHOW_BOOKED_SLOT,
    CHANGE_STATUS,
    DISPLAY_APPOINTMENTS,
    UPDATE_DOCTOR
} = ROUTE_CONSTANTS;

router.put(UPDATE_DOCTOR,authenticateUser,doctorController.updateDoctor)
router.get(DISPLAY_APPOINTMENTS,authenticateUser,doctorController.displayAppointments)
router.get(SHOW_BOOKED_SLOT,authenticateUser,doctorController.displayScheduledAppointments)
export default router;
