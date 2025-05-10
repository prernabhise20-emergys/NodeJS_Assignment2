import {
    ERROR_MESSAGE,
    SUCCESS_MESSAGE,
    SUCCESS_STATUS_CODE,
    ERROR_STATUS_CODE
} from "../common/constants/statusConstant.js";
import formatDate from "../common/utility/formattedDate.js";
import { ResponseHandler } from "../common/utility/handlers.js";
import { uploadFile } from "../common/utility/upload.js";
import sendPrescription from "../common/utility/sendPrescription.js";
import sendUpdatePrescriptionEmail from "../common/utility/sendUpdatePrescriptionEmail.js";
import sendCancelledAppointmentEmail from "../common/utility/cancelledAppointment.js";

// import xlsx from 'xlsx';
// import puppeteer from "puppeteer";
// import { createPrescription } from '../common/utility/createPrescription.js';

import {
    getObservationData,
    deleteObservationData,
    editObservationData,
    addObservationData,
    markCancelled,
    changeAvailabilityStatus,
    updatePrescription,
    getPrescriptionByAppointmentId,
    getAppointmentData,
    savePrescription,
    showAppointments,
    updateDoctorData,
    getDoctor
} from "../models/doctorModel.js";

const getDoctorProfile = async (req, res, next) => {
    try {
        const { user: { userid } } = req;

        const doctorData = await getDoctor(userid);

        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
            new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.DOCTOR_PROFILE, doctorData)
        );
    } catch (error) {
        next(error)
    }
};
const updateDoctor = async (req, res, next) => {
    try {
        const {
            body: {
                name,
                specialization,
                contact_number,
                doctorInTime,
                doctorOutTime
            },
        } = req;
        if(!name|| !specialization|| !doctorInTime||!doctorOutTime||!contact_number){
            return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
              new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
            );
          }
        const dname = name.split(' ')
        const first_name = dname[0]
        const last_name = dname[1]
        const { user: { doctor: is_doctor, email } } = req;

        const data = {
            name,
            specialization,
            contact_number,
            doctorInTime,
            doctorOutTime
        };

        if (is_doctor) {
            await updateDoctorData(data, first_name, last_name, email);
            return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
                new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.UPDATED_DOCTOR_INFO_MESSAGE)
            );
        }

        return res.status(ERROR_STATUS_CODE.FORBIDDEN).send(
            new ResponseHandler(ERROR_STATUS_CODE.FORBIDDEN, ERROR_MESSAGE.ADMIN_ACCESS)
        );
    } catch (error) {
        next(error);
    }
};


const displayAppointments = async (req, res, next) => {
    try {
        const { user: { doctor: is_doctor, admin: is_admin, userid: user_id } } = req;

        if (is_doctor || is_admin) {
            const appointments = await showAppointments(user_id);
            console.log(appointments);

            return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
                new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.SCHEDULED_APPOINTMENTS, appointments)
            );
        } else {
            return res.status(ERROR_STATUS_CODE.INVALID).send(
                new ResponseHandler(ERROR_STATUS_CODE.INVALID, ERROR_MESSAGE.UNAUTHORIZED_ACCESS_MESSAGE)
            );
        }
    } catch (error) {
        next(error);
    }
};





// const uploadPrescription = async (req, res, next) => {
//     try {
//       const { appointment_id, capacity, diagnosis, medicines } = req.body;
//       const { email, doctor } = req.user;

//       if (!doctor) {
//         return res.status(ERROR_STATUS_CODE.FORBIDDEN).send(
//           new ResponseHandler(ERROR_MESSAGE.UNAUTHORIZED_ACCESS_MESSAGE)
//         );
//       }
//       else{


//       if (!appointment_id || !capacity || !diagnosis || !medicines) {
//         return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
//           new ResponseHandler(ERROR_MESSAGE.INVALID_INPUT)
//         );
//       }

//       const prescriptionData = [
//         ['Appointment ID', 'Diagnosis', 'Medicines', 'Capacity'],
//         [appointment_id, diagnosis, medicines, capacity],
//       ];

//       const ws = xlsx.utils.aoa_to_sheet(prescriptionData);
//       const wb = xlsx.utils.book_new();
//       xlsx.utils.book_append_sheet(wb, ws, 'Prescription');

//       const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

//       const result = await uploadFile({
//         buffer: excelBuffer,
//         originalname: 'prescription.xlsx',
//       });

//       const cloudinaryBaseUrl = 'https://res.cloudinary.com/dfd5iubc8/raw/upload/';
//       const cloudinaryUniquePath = result.secure_url.split('raw/upload/')[1];
//       const fullCloudinaryUrl = cloudinaryBaseUrl + cloudinaryUniquePath;

//       await savePrescription(appointment_id, fullCloudinaryUrl);
//       await sendPrescription(email, fullCloudinaryUrl);

//       return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
//         new ResponseHandler(SUCCESS_MESSAGE.PRESCRIPTION_UPLOAD, { cloudinaryUrl: cloudinaryUniquePath })
//       );
//     }
//     } catch (error) {
//       next(error);
//     }
//   };

import { generatePdf } from "../common/utility/prescriptionPdf.js";


const uploadPrescription = async (req, res, next) => {
    try {
        const { body: { appointment_id, medicines, capacity, morning, afternoon, evening, courseDuration, notes, dosage } } = req;
        const { user: { email } } = req;
        console.log(email);

        if (!appointment_id || !medicines || !capacity || !morning || !afternoon || !evening || !dosage || !courseDuration || !notes) {
            return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
                new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
            );
        }

        const patientData = await getAppointmentData(appointment_id);


        const { patient_id, patientName, date: appointmentDate, age, doctorName, specialization, gender, date_of_birth } = patientData;

        const formattedAppointmentDate = formatDate(appointmentDate);
        const formattedBirthDate = formatDate(date_of_birth);

        const data = { medicines, capacity, dosage, notes, morning, afternoon, evening, courseDuration };

        const pdfBuffer = await generatePdf(data, patientName, formattedAppointmentDate, age, gender, doctorName, specialization, formattedBirthDate);
        const result = await uploadFile({ buffer: pdfBuffer, originalname: "prescription.pdf" }, patient_id);

        if (!result || !result.secure_url) {
            return res.status(ERROR_STATUS_CODE.INTERNAL_ERROR).send(
                new ResponseHandler(ERROR_STATUS_CODE.INTERNAL_ERROR, "Failed to upload prescription")
            );
        }

        const cloudinaryUniquePath = result.secure_url.split("raw/upload/")[1];

        await savePrescription(appointment_id, cloudinaryUniquePath, new Date().toISOString().slice(0, 19).replace("T", " "));
        await sendPrescription(email, result.secure_url);

        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
            new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.PRESCRIPTION_UPLOAD, { cloudinaryUrl: cloudinaryUniquePath })
        );
    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
};

const updateExistsPrescription = async (req, res, next) => {
    try {
        const {
            body: {
                appointment_id,
                medicines,
                capacity,
                morning,
                afternoon,
                evening,
                courseDuration,
                notes,
                dosage
            }
        } = req;

        const { user: { email } } = req;

        if (
            !appointment_id || !medicines || !capacity || !morning ||
            !afternoon || !evening || !dosage || !courseDuration || !notes
        ) {
            return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
                new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
            );
        }

        const patientData = await getAppointmentData(appointment_id);
        const {
            patient_id,
            patientName,
            date: appointmentDate,
            age,
            doctorName,
            specialization,
            gender,
            date_of_birth
        } = patientData;

        const formattedAppointmentDate = formatDate(appointmentDate);
        const formattedBirthDate = formatDate(date_of_birth);

        const data = {
            medicines,
            capacity,
            dosage,
            notes,  // ✅ Ensure notes is passed to generatePdf
            morning,
            afternoon,
            evening,
            courseDuration
        };

        const pdfBuffer = await generatePdf(
            data,
            patientName,
            formattedAppointmentDate,
            age,
            gender,
            doctorName,
            specialization,
            formattedBirthDate
        );

        const result = await uploadFile(
            {
                buffer: pdfBuffer,
                originalname: "prescription.pdf"
            },
            patient_id
        );

        if (!result || !result.secure_url) {
            return res.status(ERROR_STATUS_CODE.INTERNAL_ERROR).send(
                new ResponseHandler(ERROR_STATUS_CODE.INTERNAL_ERROR, "Failed to upload prescription")
            );
        }

        const cloudinaryUniquePath = result.secure_url.split("raw/upload/")[1];
        const existingPrescription = await getPrescriptionByAppointmentId(appointment_id);
        const dateIssued = new Date().toISOString().slice(0, 19).replace("T", " ");

        if (existingPrescription) {
            await updatePrescription(appointment_id, cloudinaryUniquePath, dateIssued);
        } else {
            await savePrescription(appointment_id, cloudinaryUniquePath, dateIssued);
        }

        await sendUpdatePrescriptionEmail(email, result.secure_url);

        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
            new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.PRESCRIPTION_UPLOAD, {
                cloudinaryUrl: cloudinaryUniquePath
            })
        );
    } catch (error) {
        console.error("Error in updateExistsPrescription:", error); // ✅ Log for debugging
        next(error);
    }
};


const changeDoctorAvailabilityStatus = async (req, res, next) => {
    try {
        const { body: { is_available, unavailable_from_date, unavailable_to_date } } = req;
        const { user: { doctor: is_doctor, userid } } = req;
       
        if (!is_doctor) {
            return res.status(ERROR_STATUS_CODE.FORBIDDEN).send(
                new ResponseHandler(ERROR_STATUS_CODE.FORBIDDEN, ERROR_MESSAGE.UNAUTHORIZED)
            );
        }

      console.log(is_available, unavailable_from_date, unavailable_to_date);
      
        await changeAvailabilityStatus(is_available, userid, unavailable_from_date, unavailable_to_date);

        const cancelAppointments = await markCancelled(unavailable_from_date, unavailable_to_date);

        if (cancelAppointments.length > 0) {
            await Promise.all(cancelAppointments.map(async (appointment) => {
                const { email, patient_name, appointment_date, appointment_time, name } = appointment;
                const reason = 'Doctor unavailability';
                console.log(email, patient_name, appointment_date, appointment_time, name);
                await sendCancelledAppointmentEmail(email, reason, patient_name, appointment_date, appointment_time, name);
            }));

            return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
                new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.CHANGE_DOCTOR_STATUS)
            );
        }

        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
            new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.NOT_CHANGE_STATUS)
        );

    } catch (error) {
        next(error);
    }
};

const addObservation = async (req, res, next) => {
    const { query: { appointment_id } } = req;
    const { body: { observation } } = req;

    if(!appointment_id||!observation){
        return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
          new ResponseHandler(ERROR_STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.REQUIRED_FIELDS)
        );
      }
    await addObservationData(observation, appointment_id);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.OBSERVATION_ADDED)
    );
}

const editObservation = async (req, res, next) => {
    const { query: { appointment_id } } = req;
    const { body: { observation } } = req;
console.log(observation);

    await editObservationData(observation, appointment_id);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.OBSERVATION_EDIT)
    );
}

const deleteObservation = async (req, res, next) => {
    const { query: { appointment_id } } = req;

    await deleteObservationData( appointment_id);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.OBSERVATION_DELETE)
    );
}

const getObservation = async (req, res, next) => {
    const { query: { appointment_id } } = req;

   const observation= await getObservationData( appointment_id);
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
        new ResponseHandler(SUCCESS_STATUS_CODE.SUCCESS, SUCCESS_MESSAGE.OBSERVATION_GET,observation)
    );
}
export default {
    getObservation,
    deleteObservation,
    editObservation,
    addObservation,
    changeDoctorAvailabilityStatus,
    formatDate,
    updateExistsPrescription,
    getDoctorProfile,
    uploadPrescription,
    updateDoctor,
    displayAppointments
}