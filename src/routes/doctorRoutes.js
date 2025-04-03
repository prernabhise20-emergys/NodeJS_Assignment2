import express from "express";
import doctorController from "../controllers/doctorController.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";

const router = express.Router();

const {
    UPDATE_DOCTOR
} = ROUTE_CONSTANTS;

router.put(UPDATE_DOCTOR,authenticateUser,doctorController.updateDoctor)

export default router;
