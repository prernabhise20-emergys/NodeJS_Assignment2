import {
    ERROR_MESSAGE,
    SUCCESS_MESSAGE,
    SUCCESS_STATUS_CODE,
    ERROR_STATUS_CODE
} from "../common/constants/statusConstant.js";
import { ResponseHandler } from "../common/utility/handlers.js";

import {
    showScheduledAppointments,
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
const displayScheduledAppointments = async (req, res, next) => {
    try {
        const { doctor_id } = req.query;
       const data= await showScheduledAppointments(doctor_id);
        return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
            new ResponseHandler(SUCCESS_MESSAGE.BOOKED_APPOINTMENTS,data)
        );
    }
    catch (error) {
        next(error)
    }
}
export default {
    displayScheduledAppointments,
    updateDoctor,
    displayAppointments
}