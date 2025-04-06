import {
    ERROR_MESSAGE,
    SUCCESS_MESSAGE,
    SUCCESS_STATUS_CODE,
    ERROR_STATUS_CODE
} from "../common/constants/statusConstant.js";
import { ResponseHandler } from "../common/utility/handlers.js";
import { uploadFile } from "../common/utility/upload.js";
import sendPrescription from "../common/utility/sendPrescription.js";

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
                email,
                doctor_id
            },
        } = req;

        const { doctor: is_doctor } = req.user;

        const data = {
            name,
            specialization,
            contact_number,
            email
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

import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const uploadPrescription = async (req, res) => {
  const { appointment_id, capacity, diagnosis, medicines } = req.body;
const {email}=req.user;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const uploadsDir = path.join(__dirname, '../../uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const prescriptionData = [
    ['appointment_id', 'Diagnosis', 'Medicines', 'Capacity'],
    [appointment_id, diagnosis, medicines, capacity],
  ];

  const ws = xlsx.utils.aoa_to_sheet(prescriptionData);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Prescription');

  try {
    const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

    const result = await uploadFile({
      buffer: excelBuffer,
      originalname: 'prescription.xlsx',
    });

    console.log('Upload result:', result);
    const cloudinaryBaseUrl = 'https://res.cloudinary.com/dfd5iubc8/raw/upload/';

    const cloudinaryUniquePath = result.secure_url.split('raw/upload/')[1];
    const fullCloudinaryUrl = cloudinaryBaseUrl + cloudinaryUniquePath;

    await savePrescription(appointment_id, fullCloudinaryUrl);
await sendPrescription(email,fullCloudinaryUrl)
    res.json({
      message: 'Prescription uploaded successfully!',
      cloudinaryUrl: cloudinaryUniquePath,  
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error creating or uploading prescription file');
  }
};

export default {
    uploadPrescription,
    updateDoctor,
    displayAppointments
}