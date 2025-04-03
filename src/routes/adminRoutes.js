import express from "express";
import adminController from "../controllers/adminController.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";

const router = express.Router();

const {
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
router.get(GET_ADMIN, authenticateUser, adminController.getAdmin);
router.post(ADD_DOCTOR,authenticateUser,adminController.addDoctor)
router.delete(DELETE_DOCTOR,authenticateUser,adminController.deleteDoctor)
export default router;
