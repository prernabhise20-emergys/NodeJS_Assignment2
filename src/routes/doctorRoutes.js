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

/**
 * @swagger
 * /api/doctor/updateDoctor:
 *   put:
 *     summary: Request for book the appointment
 *     description: Create a appointment request, after approve then sends a confirmation email.
 *     tags:
 *       - Doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of doctor
 *                 example: "Dr.Prerna Bhise"
 *               specialization:
 *                 type: string
 *                 description: Specialization of doctor
 *                 example: "MD.Medicine"
 *               contact_number:
 *                 type: string
 *                 description: Contact number of the user
 *                 example: "9876543210"
 *               doctorInTime:
 *                 type: string
 *                 description: Doctor in time
 *                 example: "10:30:00"
 *               doctorOutTime:
 *                 type: string
 *                 description: Doctor out time
 *                 example: "16:30:00"
 *               doctor_id:
 *                 type: string
 *                 format: number
 *                 description: patient id of the user
 *                 example: "2"
 *     responses:
 *       200:
 *         description: Doctor information updated successfully.
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
 *                   example: "Doctor information updated successfully."
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
