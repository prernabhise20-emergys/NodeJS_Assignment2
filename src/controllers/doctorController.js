import {
    ERROR_MESSAGE,
    SUCCESS_MESSAGE,
    SUCCESS_STATUS_CODE,
    ERROR_STATUS_CODE
} from "../common/constants/statusConstant.js";
import { ResponseHandler } from "../common/utility/handlers.js";

import {
    changeStatus,
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
const changeAppointmentsStatus = async (req, res, next) => {
    try {
        const { status, appointment_id } = req.query;
const {admin:is_admin,doctor:is_doctor}=req.user;
        if (!status || !appointment_id) {
            return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
                new ResponseHandler(ERROR_MESSAGE.INVALID_INPUT)
            );
        }
        console.log(req.query);
if(is_admin||is_doctor){
        const result = await changeStatus(status, appointment_id);

        if (result.affectedRows > 0) {
            return res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
                new ResponseHandler(SUCCESS_MESSAGE.CHANGE_STATUS)
            );
        } else {
            return res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
                new ResponseHandler(ERROR_MESSAGE.NOT_CHANGE_STATUS)
            );
        }
    }
    } catch (error) {
        next(error);
    }
};




// const changeAppointmentsStatus=async(req,res,next)=>{
//     try{
// const {status,appointment_id}=req.query;
// console.log(req.query);

// await changeStatus(status,appointment_id)
//  res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
//     new ResponseHandler(SUCCESS_MESSAGE.CHANGE_STATUS)
// );

// res.status(ERROR_STATUS_CODE.BAD_REQUEST).send(
//     new ResponseHandler(ERROR_MESSAGE.NOT_CHANGE_STATUS)
// );
//     }
//     catch(error){
//         next(error)
//     }
// }
export default {
    changeAppointmentsStatus,
    updateDoctor,
    displayAppointments
}