import express from "express";
import doctorController from "../controllers/doctorController.js";
import adminController from "../controllers/adminController.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";

const router = express.Router();

const {
    ADD_DOCTOR
} = ROUTE_CONSTANTS;

router.post(ADD_DOCTOR,authenticateUser,doctorController.addDoctor)

export default router;
