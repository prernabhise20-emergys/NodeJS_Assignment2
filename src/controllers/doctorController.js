import {
    ERROR_MESSAGE,
    SUCCESS_MESSAGE,
    SUCCESS_STATUS_CODE,
    ERROR_STATUS_CODE
    
} from "../common/constants/statusConstant.js";
import { ResponseHandler } from "../common/utility/handlers.js";
import { uploadFile } from "../common/utility/upload.js";
import sendPrescription from "../common/utility/sendPrescription.js";
import xlsx from 'xlsx';
import puppeteer from "puppeteer";

import {
    savePrescription,
    showAppointments,
    updateDoctorData
} from "../models/doctorModel.js";

const updateDoctor = async (req, res, next) => {
    try {
        const {
            body: {
                name,
                specialization,
                contact_number,
                doctor_id,
                doctorInTime,
                doctorOutTime
            },
        } = req;

        const { doctor: is_doctor } = req.user;

        const data = {
            name,
            specialization,
            contact_number,
            doctorInTime,
            doctorOutTime
        };

        console.log(data);

        if (is_doctor) {
            await updateDoctorData(data, doctor_id);

            return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
                new ResponseHandler(SUCCESS_MESSAGE.UPDATED_DOCTOR_INFO_MESSAGE)
            );
        }

        return res.status(SUCCESS_STATUS_CODE.FORBIDDEN).send(
            new ResponseHandler(ERROR_MESSAGE.ADMIN_ACCESS)
        );
    } catch (error) {
        next(error);
    }
};

const displayAppointments = async (req, res, next) => {
    try {
        const { doctor_id } = req.query;
        const { doctor: is_doctor, admin: is_admin } = req.user;
        if (is_doctor || is_admin) {
            const appointments = await showAppointments(doctor_id);

            return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
                new ResponseHandler(SUCCESS_MESSAGE.SCHEDULED_APPOINTMENTS, appointments)
            );
        }
    }
    catch (error) {
        next(error)
    }
}

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
  
const uploadPrescription = async (req, res, next) => {
    const { appointment_id, capacity, diagnosis, medicines } = req.body;
    const { email } = req.user;

    const createPrescription = (data) => {
        return `
            <html>
            <head>
                <title>Prescription</title>
            </head>
            <body>
                <h1>Prescription</h1>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Diagnosis</th>
                            <th>Medicines</th>
                            <th>Capacity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${data.appointment_id}</td>
                            <td>${data.diagnosis}</td>
                            <td>${data.medicines}</td>
                            <td>${data.capacity}</td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
        `;
    };

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const prescriptionHTML = createPrescription({ appointment_id, capacity, diagnosis, medicines });
        
        await page.setContent(prescriptionHTML);

        const pdfBuffer = await page.pdf({
            path:'prescription.pdf',
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        const result = await uploadFile({
            buffer: pdfBuffer,
            originalname: 'prescription.pdf',
        });

        const cloudinaryBaseUrl = 'https://res.cloudinary.com/dfd5iubc8/raw/upload/';

        const cloudinaryUniquePath = result.secure_url.split('raw/upload/')[1];
        const fullCloudinaryUrl = cloudinaryBaseUrl + cloudinaryUniquePath;

        await savePrescription(appointment_id, fullCloudinaryUrl);
        await sendPrescription(email, fullCloudinaryUrl);

        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
            new ResponseHandler(SUCCESS_MESSAGE.PRESCRIPTION_UPLOAD, { cloudinaryUrl: cloudinaryUniquePath })
        );
    } catch (error) {
        next(error);
    }
};

export default {
    uploadPrescription,
    updateDoctor,
    displayAppointments
}