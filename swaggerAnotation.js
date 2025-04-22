

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
 *                       example: "prernabhise999@gmail.com"
 *                     firstName:
 *                       type: string
 *                       example: "Vishal"
 *                     lastName:
 *                       type: string
 *                       example: "Mane"
 *                     mobile:
 *                       type: string
 *                       example: "9876543210"
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
 *                   example: "Invalid token."
 */

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
 *                   example: "User information updated successfully"
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
 *                   example: "User data deleted successfully"
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
 *                   example: "Invalid token."
 */

/**
 * @swagger
 * /api/user/forgotPassword:
 *   post:
 *     summary: Forgot password API.
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
 *         description: OTP is sent to your email.
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
 *                   example: "OTP is sent to your email."
 *       404:
 *         description: Email not found.
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
 *                   example: "Email not found."
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


/**
 * @swagger
 * /api/user/getDoctors:
 *   get:
 *     summary: Get doctor profile
 *     description: Returns doctor details.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor data retrieved successfully
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
 *                   example: Doctor details fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     doctor_id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Dr.Prerna Bhise"
 *                     specialization:
 *                       type: string
 *                       example: "MD.Medicine"
 *                     doctorInTime:
 *                       type: string
 *                       example: "11:00:00"
 *                     doctorOutTime:
 *                       type: string
 *                       example: "04:00:00"
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
 *                   example: "Invalid token."
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

/**
 * @swagger
 * /api/user/bookAppointment:
 *   post:
 *     summary: Book Appointment
 *     description: Create a new appointment.
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
 *                 type: number
 *                 example: 1
 *               doctor_id:
 *                 type: number
 *                 example: "6"
 *               date:
 *                 type: string
 *                 example: "2025-04-10"
 *               time:
 *                 type: string
 *                 example: "10:00:00"
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

/**
 * @swagger
 * /api/user/showAvailability:
 *   post:
 *     summary: Retrieve doctor availability for a specific date
 *     description: Get available time slots for a doctor on a given date.
 *     tags:
 *       - User
 *     parameters:
 *       - name: doctor_id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the doctor whose availability is requested.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date for which availability is needed (YYYY-MM-DD).
 *     responses:
 *       200:
 *         description: Successfully retrieved doctor availability
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctorInTime:
 *                   type: string
 *                 doctorOutTime:
 *                   type: string
 *                 timeSlot:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Doctor is not available on the specified date
 *       500:
 *         description: Server error
 */



































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











/**
 * @swagger
 * /api/admin/getAllInfo:
 *   get:
 *     summary: Retrieve all patient information.
 *     description: Only admins have access to retrieve all patient information.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Page limit.
 *     responses:
 *       200:
 *         description: Patient information retrieved successfully.
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
 *                   example: "Patient information retrieved successfully."
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

/**
 * @swagger
 * /api/patient/getPersonalInfo/{patient_id}:
 *   get:
 *     summary: Retrieve personal information of a patient
 *     description: Fetches detailed personal information about the patient including health metrics like weight, height, and age.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         description: The ID of the patient whose personal information is being retrieved.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the personal details of the patient.
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
 *                   example: "Personal information retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     patient_name:
 *                       type: string
 *                       example: "Satej"
 *                     date_of_birth:
 *                       type: string
 *                       format: date
 *                       example: "1985-02-15"
 *                     gender:
 *                       type: string
 *                       example: "Male"
 *                     age:
 *                       type: integer
 *                       example: 40
 *                     weight:
 *                       type: number
 *                       format: float
 *                       example: 75.5
 *                     height:
 *                       type: number
 *                       format: float
 *                       example: 175
 *                     bmi:
 *                       type: number
 *                       format: float
 *                       example: 24.7
 *                     country_of_origin:
 *                       type: string
 *                       example: "India"
 *                     is_diabetic:
 *                       type: boolean
 *                       example: false
 *                     cardiac_issue:
 *                       type: boolean
 *                       example: true
 *                     blood_pressure:
 *                       type: string
 *                       example: "120/80"
 *       404:
 *         description: Patient not found or invalid patient ID.
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
 *                   example: "Patient not found."
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

/**
 * @swagger
 * /api/patient/addPersonalInfo:
 *   post:
 *     summary: Add personal information for a patient
 *     description: Allows adding personal details of a patient including health metrics like weight, height, BMI, and more.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_name:
 *                 type: string
 *                 description: The name of the patient
 *                 example: "Satej"
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 description: The birthdate of the patient
 *                 example: "1985-02-15"
 *               gender:
 *                 type: string
 *                 description: The gender of the patient
 *                 example: "male"
 *               weight:
 *                 type: string
 *                 format: float
 *                 description: The weight of the patient in kilograms
 *                 example: "75.5"
 *               height:
 *                 type: number
 *                 format: string
 *                 description: The height of the patient in feet (will be converted to meters)
 *                 example: "5.8"
 *               country_of_origin:
 *                 type: string
 *                 description: The country of origin of the patient
 *                 example: "India"
 *               is_diabetic:
 *                 type: boolean
 *                 description: Whether the patient is diabetic
 *                 example: false
 *               cardiac_issue:
 *                 type: boolean
 *                 description: Whether the patient has cardiac issues
 *                 example: true
 *               blood_pressure:
 *                 type: string
 *                 description: The blood pressure of the patient
 *                 example: "false"
 *     responses:
 *       201:
 *         description: Successfully added the personal information for the patient.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Personal information added successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     patient_id:
 *                       type: integer
 *                       description: The unique ID assigned to the patient
 *                       example: 1
 *       400:
 *         description: Bad request, invalid input data.
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
 *                   example: "Invalid data provided."
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

/**
 * @swagger
 * /api/patient/updatePersonalData:
 *   put:
 *     summary: Update personal information for a patient
 *     description: Allows updating the personal details of a patient, including health metrics such as weight, height, BMI, and more.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_name:
 *                 type: string
 *                 description: The name of the patient
 *                 example: "Satej"
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 description: The birthdate of the patient
 *                 example: "1985-02-15"
 *               gender:
 *                 type: string
 *                 description: The gender of the patient
 *                 example: "Male"
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: The weight of the patient in kilograms
 *                 example: 75.5
 *               height:
 *                 type: number
 *                 format: float
 *                 description: The height of the patient in feet (will be converted to meters)
 *                 example: 5.8
 *               country_of_origin:
 *                 type: string
 *                 description: The country of origin of the patient
 *                 example: "India"
 *               is_diabetic:
 *                 type: boolean
 *                 description: Whether the patient is diabetic
 *                 example: false
 *               cardiac_issue:
 *                 type: boolean
 *                 description: Whether the patient has cardiac issues
 *                 example: true
 *               blood_pressure:
 *                 type: boolean
 *                 description: Whether the patient has blood pressure issues
 *                 example: true
 *               patient_id:
 *                 type: integer
 *                 description: The unique ID of the patient whose personal information is to be updated
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully updated the personal information for the patient.
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
 *                   example: "Personal information updated successfully."
 *       400:
 *         description: Bad request, invalid input data.
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
 *                   example: "Invalid data provided."
 *       401:
 *         description: Unauthorized access, the user is not authorized to update the patient's information.
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
 *                   example: "Unauthorized access."
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


/**
 * @swagger
 * /api/patient/deletePersonalData/{patient_id}:
 *   delete:
 *     summary: Delete personal information of a patient
 *     description: This endpoint allows an authorized user to delete the personal information of a specific patient by marking it as deleted.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         description: The unique ID of the patient whose personal information is to be deleted.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Personal information deleted successfully.
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
 *                   example: "Personal information deleted successfully."
 *       401:
 *         description: Unauthorized access, the user is not authorized to delete the personal information.
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
 *                   example: "Unauthorized access."
 *       404:
 *         description: The patient with the provided ID does not exist or has already been deleted.
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
 *                   example: "Patient not found or already deleted."
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


/**
 * @swagger
 * /api/patient/getFamilyInfo/{patient_id}:
 *   get:
 *     summary: Retrieve family information of a patient
 *     description: This endpoint allows an authorized user to retrieve the family information of a specific patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         description: The unique ID of the patient whose family information is to be retrieved.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Family information retrieved successfully.
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
 *                   example: "Family information retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     father_name:
 *                       type: string
 *                       example: "ram"
 *                     father_age:
 *                       type: integer
 *                       example: 50
 *                     father_country_origin:
 *                       type: string
 *                       example: "USA"
 *                     mother_name:
 *                       type: string
 *                       example: "mala"
 *                     mother_age:
 *                       type: integer
 *                       example: 48
 *                     mother_country_origin:
 *                       type: string
 *                       example: "USA"
 *                     mother_diabetic:
 *                       type: boolean
 *                       example: false
 *                     mother_cardiac_issue:
 *                       type: boolean
 *                       example: false
 *                     mother_bp:
 *                       type: boolean
 *                       example: true
 *                     father_diabetic:
 *                       type: boolean
 *                       example: true
 *                     father_cardiac_issue:
 *                       type: boolean
 *                       example: false
 *                     father_bp:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Family information not found or patient not found.
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
 *                   example: "Family information not found or patient not found."
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


/**
 * @swagger
 * /api/patient/getPatientInfo:
 *   get:
 *     summary: Retrieve patient details
 *     description: This endpoint retrieves the details of the authenticated patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patient details retrieved successfully.
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
 *                   example: "Patient details retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     patient_id:
 *                       type: integer
 *                       example: 1
 *                     patient_name:
 *                       type: string
 *                       example: "Satej"
 *                     date_of_birth:
 *                       type: string
 *                       format: date
 *                       example: "1980-01-01"
 */

/**
 * @swagger
 * /api/patient/addFamilyInfo:
 *   post:
 *     summary: Add family information for a patient
 *     description: This endpoint allows an authenticated user to add family information for a specific patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               familyDetails:
 *                 type: object
 *                 properties:
 *                   patient_id:
 *                     type: integer
 *                     example: 1
 *                   father_name:
 *                     type: string
 *                     example: "ram"
 *                   mother_name:
 *                     type: string
 *                     example: "mala"
 *                   father_age:
 *                     type: integer
 *                     example: 50
 *                   mother_age:
 *                     type: integer
 *                     example: 48
 *                   father_country_origin:
 *                     type: string
 *                     example: "USA"
 *                   mother_country_origin:
 *                     type: string
 *                     example: "USA"
 *                   father_diabetic:
 *                     type: boolean
 *                     example: true
 *                   mother_diabetic:
 *                     type: boolean
 *                     example: false
 *                   father_cardiac_issue:
 *                     type: boolean
 *                     example: true
 *                   mother_cardiac_issue:
 *                     type: boolean
 *                     example: false
 *                   father_bp:
 *                     type: boolean
 *                     example: false
 *                   mother_bp:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: Family information added successfully.
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
 *                   example: "Family information added successfully."
 */

/**
 * @swagger
 * /api/patient/updateFamilyInfo:
 *   put:
 *     summary: Update family information for a patient
 *     description: This endpoint allows an authenticated user to update family information for a specific patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               father_name:
 *                 type: string
 *                 example: "ram"
 *               father_age:
 *                 type: integer
 *                 example: 50
 *               father_country_origin:
 *                 type: string
 *                 example: "USA"
 *               mother_name:
 *                 type: string
 *                 example: "mala"
 *               mother_age:
 *                 type: integer
 *                 example: 48
 *               mother_country_origin:
 *                 type: string
 *                 example: "USA"
 *               mother_diabetic:
 *                 type: boolean
 *                 example: false
 *               mother_cardiac_issue:
 *                 type: boolean
 *                 example: false
 *               mother_bp:
 *                 type: boolean
 *                 example: true
 *               father_diabetic:
 *                 type: boolean
 *                 example: true
 *               father_cardiac_issue:
 *                 type: boolean
 *                 example: false
 *               father_bp:
 *                 type: boolean
 *                 example: true
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Family information updated successfully.
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
 *                   example: "Family information updated successfully."
 */

/**
 * @swagger
 * /api/patient/deleteFamilyInfo:
 *   delete:
 *     summary: Delete family information for a patient
 *     description: This endpoint allows an authenticated user to delete the family information for a specific patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         description: The unique ID of the patient whose family information is to be deleted.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Family information deleted successfully.
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
 *                   example: "Family information deleted successfully."
 */

/**
 * @swagger
 * /api/patient/getDiseaseDetails/{patient_id}:
 *   get:
 *     summary: Retrieve disease information for a patient
 *     description: This endpoint retrieves the disease information of a specific patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         description: The unique ID of the patient whose disease information is to be retrieved.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Disease information retrieved successfully.
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
 *                   example: "Disease information retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     disease_type:
 *                       type: string
 *                       example: "Hypertension"
 *                     disease_description:
 *                       type: string
 *                       example: "due to stress."
 */

/**
 * @swagger
 * /api/patient/addDiseaseInfo:
 *   post:
 *     summary: Add disease information for a patient
 *     description: This endpoint allows an authenticated user to add disease information for a specific patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diseaseDetails:
 *                 type: object
 *                 properties:
 *                   patient_id:
 *                     type: integer
 *                     example: 1
 *                   disease_type:
 *                     type: string
 *                     example: "Hypertension"
 *                   disease_description:
 *                     type: string
 *                     example: "due to stress."
 *     responses:
 *       200:
 *         description: Disease information added successfully.
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
 *                   example: "Disease information added successfully."
 */

/**
 * @swagger
 * /api/patient/updateDiseaseInfo:
 *   put:
 *     summary: Update disease information for a patient
 *     description: This endpoint allows an authenticated user to update disease information for a specific patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disease_type:
 *                 type: string
 *                 example: "Hypertension"
 *               disease_description:
 *                 type: string
 *                 example: "due to stress."
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Disease information updated successfully.
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
 *                   example: "Disease information updated successfully."
 */

/**
 * @swagger
 * /api/patient/deleteDiseaseInfo:
 *   delete:
 *     summary: Delete disease information for a patient
 *     description: This endpoint allows an authenticated user to delete disease information for a specific patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         description: The unique ID of the patient whose disease information is to be deleted.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Disease information deleted successfully.
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
 *                   example: "Disease information deleted successfully."
 */


/**
 * @swagger
 * /api/patient/getUploadInfo/{patient_id}:
 *   get:
 *     summary: Get uploaded documents for a patient
 *     description: Retrieve all uploaded document metadata for a specific patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patient_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: Document metadata retrieved successfully
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
 *                   example: Documents retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       document_type:
 *                         type: string
 *                         example: "adhar"
 *                       document_url:
 *                         type: string
 *                         example: "documents/userid/filename.png"
 */

/**
 * @swagger
 * /api/patient/upload:
 *   post:
 *     summary: Upload a document
 *     description: Upload a single document file (PDF/Image/etc) for a patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - document_type
 *               - patient_id
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               document_type:
 *                 type: string
 *                 example: "Adhar"
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Document uploaded successfully
 *                 data:
 *                   type: string
 *                   example: "documents/userid/filename.png"
 */

/**
 * @swagger
 * /api/patient/update-document:
 *   put:
 *     summary: Update a patient's existing document
 *     description: Replaces an existing document by document_type for a patient.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - document_type
 *               - patient_id
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               document_type:
 *                 type: string
 *                 example: "X-ray"
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Document updated successfully
 */

/**
 * @swagger
 * /api/patient/download-document:
 *   get:
 *     summary: Download a specific document
 *     description: Redirects to the cloud URL of a document associated with the patient and document type.
 *     tags:
 *       - Patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: patient_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the patient
 *       - in: query
 *         name: document_type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type of the document to download
 *     responses:
 *       302:
 *         description: Redirects to the document URL
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: Document not found
 */


/**
 * @swagger
 * /api/admin/adminDeletePatientData:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Admin deletes a patient's data
 *     parameters:
 *       - in: query
 *         name: patient_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the patient to delete
 *     responses:
 *       200:
 *         description: Successfully deleted patient data
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/admin/getAgeGroup:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get age group distribution of patients
 *     responses:
 *       200:
 *         description: Age group data retrieved successfully
 */

/**
 * @swagger
 * /api/admin/addAdmin:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Grant admin privileges to a user
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
 *     responses:
 *       200:
 *         description: Admin privileges granted
 */

/**
 * @swagger
 * /api/admin/removeAdmin:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Revoke admin privileges
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
 *     responses:
 *       200:
 *         description: Admin privileges revoked
 */

/**
 * @swagger
 * /api/admin/getAdmin:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get list of all admins
 *     responses:
 *       200:
 *         description: Admins retrieved successfully
 */

/**
 * @swagger
 * /api/admin/addDoctor:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Add a doctor to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *               contact_number:
 *                 type: string
 *               email:
 *                 type: string
 *               doctorInTime:
 *                 type: string
 *               doctorOutTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor added successfully
 */

/**
 * @swagger
 * /api/admin/deleteDoctor:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a doctor
 *     parameters:
 *       - in: query
 *         name: doctor_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 */

/**
 * @swagger
 * /api/admin/changeStatus:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Change the status of an appointment
 *     parameters:
 *       - in: query
 *         name: appointment_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status changed successfully
 */

/**
 * @swagger
 * /api/admin/approveAppoint:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Approve a pending appointment
 *     parameters:
 *       - in: query
 *         name: appointment_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment approved
 */

/**
 * @swagger
 * /api/admin/displayAppointmentRequest:
 *   get:
 *     tags:
 *       - Admin
 *     summary: View appointment requests
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 */

/**
 * @swagger
 * /api/admin/allAppointments:
 *   get:
 *     tags:
 *       - Admin
 *     summary: View all appointments with particular doctor id
 *     parameters:
 *       - in: query
 *         name: doctor_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 */


/**
 * @swagger
 * /api/admin/appointments:
 *   get:
 *     tags:
 *       - Admin
 *     summary: View all appointments 
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 */

/**
 * @swagger
 * /api/user/searchDoctor:
 *    get:
 *     tags:
 *       - User
 *     summary: Search a doctor
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Doctor searched successfully
 *       500:
 *         description: Internal server error
 */