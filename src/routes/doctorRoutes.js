import express from "express";
import doctorController from "../controllers/doctorController.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";

const router = express.Router();

const {
    DISPLAY_APPOINTMENTS,
    UPDATE_DOCTOR
} = ROUTE_CONSTANTS;

router.put(UPDATE_DOCTOR,authenticateUser,doctorController.updateDoctor)
router.put(DISPLAY_APPOINTMENTS,authenticateUser,doctorController.displayAppointments)

export default router;
