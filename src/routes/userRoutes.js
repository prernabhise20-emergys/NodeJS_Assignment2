import express from "express";
import userController from "../controllers/userController.js";
import { schemaValidator } from "../middlewares/userValidation.js";
import { user_schemas } from "../common/constants/schemaConstant.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";

const router = express.Router();

const {
  FORGET_PASSWORD,
  REGISTER,
  LOGIN,
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
  RESET_PASSWORD,
} = ROUTE_CONSTANTS;

router.post(
  REGISTER,
  schemaValidator(user_schemas.createUserSchema),
  userController.register
);
router.post(
  LOGIN,
  schemaValidator(user_schemas.userLoginSchema),
  userController.login
);
router.get(GET_USER, authenticateUser, userController.getUser);
router.put(
  UPDATE_USER,
  authenticateUser,
  schemaValidator(user_schemas.updateUserSchema),
  userController.updateUser
);
router.delete(DELETE_USER, authenticateUser, userController.deleteUser);
router.post(FORGET_PASSWORD, userController.forgotPassword);
router.put(RESET_PASSWORD, userController.resetPassword);

export default router;
