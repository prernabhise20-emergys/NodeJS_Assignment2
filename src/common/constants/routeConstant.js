const ROUTE_CONSTANTS = {
  USER: "/api/user",
  REGISTER: "/register",
  LOGIN: "/login",
  GET_USER: "/getUser",
  UPDATE_USER: "/updateUser",
  DELETE_USER: "/deleteUser",
  PATIENT: "/api/patient",
  ADD_ADMIN: "/addAdmin",
  REMOVE_ADMIN: "/removeAdmin",
  GET_ALL_PATIENT_DETAILS: "/getAllInfo",
  ADD_PERSONAL_DATA: "/addPersonalInfo",
  UPDATE_PERSONAL_DATA: "/updatePersonalInfo",
  DELETE_PERSONAL_DATA: "/deletePersonalInfo/:patient_id",
  ADD_FAMILY_DATA: "/addFamilyInfo",
  GET_PATIENT_INFO: "/getPatientInfo",
  UPDATE_FAMILY_INFO: "/updateFamilyInfo",
  DELETE_FAMILY_INFO: "/deleteFamilyInfo/:patient_id",
  ADD_DISEASE_INFO: "/addDiseaseInfo",
  UPDATE_DISEASE_INFO: "/updateDiseaseInfo",
  DELETE_DISEASE_INFO: "/deleteDiseaseInfo/:patient_id",
  UPLOAD_DOCUMENTS: "/upload",
  UPDATE_DOCUMENT:"/updateDocument",
  DELETE_DOCUMENT:"/deleteDocument",
  GET_UPLOAD_INFO:"/getUploadInfo/:patient_id",
  GET_FAMILY_INFO:"/getFamilyInfo/:patient_id",
  GET_DISEASE_INFO:"/getDiseaseInfo/:patient_id",
  GET_PERSONAL_INFO:"/getPersonalInfo/:patient_id",
  ADMIN_DELETE_PATIENT_DATA:"/adminDeletePatientData",
  GET_AGE_GROUP:"/getAgeGroup",
  FORGET_PASSWORD:"/forgotPassword",
  RESET_PASSWORD:"/resetPassword",
  DOWNLOAD_DOCUMENT:"/downloadDocument",
  ADMIN:"/api/admin",
  GET_ADMIN:"/getAdmin",
  DOCTOR:"/api/doctor",
  ADD_DOCTOR:"/addDoctor",
  UPDATE_DOCTOR:"/updateDoctor",
  DELETE_DOCTOR:"/deleteDoctor",
  GET_DOCTORS:"/getDoctors",
  CREATE_APPOINTMENT:"/bookAppointment",
  GET_TIMESLOT:"/getTimeSlot",
  DISPLAY_APPOINTMENTS:"/displayAppointments",
  CHANGE_STATUS:"/changeStatus",
  SHOW_BOOKED_SLOT:"/bookedSlot",
  APPROVE_APPOINTMENT:"/approveAppoint",
  APPOINTMENT_REQUEST:"/displayAppointmentRequest",
  SHOW_AVAILABILITY:"/showAvailability",
  ADD_PRISCRIPTION:"/addPrescription",
  ALL_APPOINTMENTS:"/allAppointments",
  APPOINTMENTS:"/appointments",
  ALL_EMAIL_ADMIN:"/getEmailsForAdmin",
  ALL_EMAIL_DOCTOR:"/getEmailsForDoctor",
  GET_DOCTOR_PROFILE:"/getDoctorProfile",
  UPDATE_PRISCRIPTION:"/updatePrescription"
};

export default ROUTE_CONSTANTS;
