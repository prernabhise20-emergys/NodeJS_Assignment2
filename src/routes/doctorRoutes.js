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
 *     summary: Update the doctor profile
 *     description: Only doctor allow to update profile.
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

/**
 * @swagger
 * /api/doctor/displayAppointments:
 *   get:
 *     summary: Retrieve scheduled appointments
 *     description: Doctors can view their scheduled appointments.
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctor_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *         description: ID of the doctor
 *     responses:
 *       200:
 *         description: Appointment information retrieved successfully.
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
 *                   example: "Appointment information retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment_id:
 *                       type: integer
 *                       example: 1
 *                     patient_name:
 *                       type: string
 *                       example: "Prerna Bhise"
 *                     gender:
 *                       type: string
 *                       example: "Female"
 *                     age:
 *                       type: integer
 *                       example: 22
 *                     disease_type:
 *                       type: string
 *                       example: "Fever"
 *                     appointment_date:
 *                       type: string
 *                       format: date
 *                       description: Appointment date
 *                       example: "2025-04-11"
 *                     appointment_time:
 *                       type: string
 *                       format: time
 *                       description: Appointment time
 *                       example: "16:30:00"
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
  DISPLAY_APPOINTMENTS,
  authenticateUser,
  doctorController.displayAppointments
)

/**
 * @swagger
 * /api/doctor/addPriscription:
 *   post:
 *     summary: Upload a medical prescription
 *     description: Only doctors are allowed to upload a prescription.
 *     tags:
 *       - Doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointment_id:
 *                 type: integer
 *                 example: 2
 *               medicines:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Paracetamol", "Ibuprofen"]
 *               capacity:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["500mg", "150mg"]
 *               dosage:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["1 tablet", "half tablet"]
 *               morning:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["before meal", "both", "after meal"]
 *               afternoon:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["after meal", "before meal", "both"]
 *               evening:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["false", "after meal", "both"]
 *               courseDuration:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       200:
 *         description: Prescription uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cloudinaryUrl:
 *                   type: string
 *                   example: "https://res.cloudinary.com/dfd5iubc8/raw/upload/sample.pdf"
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

router.post(
  ADD_PRISCRIPTION,
  authenticateUser,
  upload.single('file'),
  doctorController.uploadPrescription
)

export default router;
