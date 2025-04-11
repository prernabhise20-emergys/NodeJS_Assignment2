import express from "express";
import userController from "../controllers/userController.js";
import { schemaValidator } from "../middlewares/userValidation.js";
import { user_schemas } from "../common/constants/schemaConstant.js";
import authenticateUser from "../middlewares/authMiddleware.js";
import ROUTE_CONSTANTS from "../common/constants/routeConstant.js";

const router = express.Router();

const {
  CREATE_APPOINTMENT,
  GET_DOCTORS,
  FORGET_PASSWORD,
  REGISTER,
  LOGIN,
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
  RESET_PASSWORD,
} = ROUTE_CONSTANTS;


/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user and sends a verification email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: "prernabhise999@gmail.com"
 *               user_password:
 *                 type: string
 *                 format: password
 *                 description: Password for the user account
 *                 example: "123456"
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *                 example: "Prerna"
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *                 example: "Bhise"
 *               mobile_number:
 *                 type: string
 *                 description: Mobile number of the user
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Registration successful"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post(
  REGISTER,
  schemaValidator(user_schemas.createUserSchema),
  userController.register
);
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user with email and password.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: "p9@gmail.com"
 *               user_password:
 *                 type: string
 *                 format: password
 *                 description: Password for the user account
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Login successfully"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post(
  LOGIN,
  schemaValidator(user_schemas.userLoginSchema),
  userController.login
);

/**
 * @swagger
 * /api/user/getUser:
 *   get:
 *     summary: Get user profile
 *     description: Returns user details of logged-in user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User details fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 16
 *                     email:
 *                       type: string
 *                       example: prernabhise999@gmail.com
 *                     firstName:
 *                       type: string
 *                       example: Vishal
 *                     lastName:
 *                       type: string
 *                       example: Mane
 *                     mobile:
 *                       type: string
 *                       example: 9876543210
 *       401:
 *         description: Unauthorized - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Invalid token.
 */


router.get(GET_USER,
  authenticateUser,
  userController.getUser
);

/**
 * @swagger
 * /api/user/updateUser:
 *   put:
 *     summary: Update a user
 *     description: Update a user details.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *                 example: "Prerna"
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *                 example: "Bhise"
 *               mobile_number:
 *                 type: string
 *                 description: Mobile number of the user
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: User information updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: " User information updated successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.put(
  UPDATE_USER,
  authenticateUser,
  schemaValidator(user_schemas.updateUserSchema),
  userController.updateUser
);

/**
 * @swagger
 * /api/user/deleteUser:
 *   delete:
 *     summary: Delete user profile
 *     description: Delete a user logged-in information.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example:  User data deleted successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Invalid token.
 */

router.delete(
  DELETE_USER,
  authenticateUser,
  userController.deleteUser
);

/**
 * @swagger
 * /api/user/forgotPassword:
 *   post:
 *     summary: Forgot password api.
 *     description: Change the password with the help of email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: "prernabhise999@gmail.com"
 *     responses:
 *       200:
 *         description: OTP is sent to yuor email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OTP is sent to yuor email.
 *       404:
 *         description: Email is not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Email is not found.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post(
  FORGET_PASSWORD,
  userController.forgotPassword
);

/**
 * @swagger
 * /api/user/resetPassword:
 *   put:
 *     summary: Reset user password.
 *     description: Allows the user to change their password using an email and a one-time password (OTP).
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user.
 *                 example: "p9@gmail.com"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user's account.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Password has been changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Password has been changed successfully."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */


router.put(
  RESET_PASSWORD,
  userController.resetPassword
);
/**
 * @swagger
 * /api/user/getDoctors:
 *   get:
 *     summary: Get Doctors Information
 *     description: Returns user details of doctors.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Doctor information retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     doctor_id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Dr.Prerna Bhise
 *                     specialization:
 *                       type: string
 *                       example: Physiotherapiest
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router.get(
  GET_DOCTORS,
  authenticateUser,
  userController.getDoctors
)

/**
 * @swagger
 * /api/user/bookAppointment:
 *   post:
 *     summary: Request for book the appointment
 *     description: Create a appointment request, after approve then sends a confirmation email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: string
 *                 format: number
 *                 description: patient id of the user
 *                 example: "1"
 *               doctor_id:
 *                 type: string
 *                 format: number
 *                 description: patient id of the user
 *                 example: "2"
 *               Date:
 *                 type: string
 *                 description: date of appointment
 *                 example: "2025-04-10"
 *               time:
 *                 type: string
 *                 description: time of appointment
 *                 example: "1:30:00"
 *     responses:
 *       200:
 *         description: Appointment request sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Appointment request sent successfully."
 *       400:
 *         description: The selected time slot is already booked. Please choose another time.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "The selected time slot is already booked. Please choose another time."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post(
  CREATE_APPOINTMENT,
  authenticateUser,
  userController.createAppointment
)

export default router;
