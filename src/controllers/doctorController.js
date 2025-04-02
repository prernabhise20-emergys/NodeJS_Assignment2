import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ResponseHandler } from "../common/utility/handlers.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";

import {

} from "../models/userModel.js";
import {
  SUCCESS_STATUS_CODE,
  SUCCESS_MESSAGE,
} from "../common/constants/statusConstant.js";

dotenv.config();
const {

} = AUTH_RESPONSES;




const addDoctor = async (req, res,next) => {
    try {
      const {
        body: {
          patient_name,
          date_of_birth,
          gender,
          weight,
          height,
          country_of_origin,
          is_diabetic,
          cardiac_issue,
          blood_pressure,
        },
      } = req;
  
      const { userid: id, email } = req.user;
      const data = {
        patient_name,
        date_of_birth,
        gender,
        weight,
        height,
        country_of_origin,
        is_diabetic,
        cardiac_issue,
        blood_pressure,
      };
  
      const result = await createPersonalDetails(data, id, email);
  
      res.status(SUCCESS_STATUS_CODE.CREATED).send(
        new ResponseHandler(SUCCESS_MESSAGE.ADDED_PERSONAL_INFO_MESSAGE,{patient_id: result.insertId})
      );
     
    } catch (error) {
    next(error)
    }
  };
  
  const updatePersonalInfo = async (req, res,next) => {
    try {
      const {
        body: {
          patient_name,
          date_of_birth,
          gender,
          weight,
          height,
          country_of_origin,
          is_diabetic: diabetic,
          cardiac_issue: cardiac,
          blood_pressure: pressure,
          patient_id,
        },
      } = req;
  
      const is_diabetic = diabetic === true || diabetic === 1;
      const cardiac_issue = cardiac === true || cardiac === 1;
      const blood_pressure = pressure === true || pressure === 1;
  
      const data = {
        patient_name,
        date_of_birth,
        gender,
        weight,
        height,
        country_of_origin,
        is_diabetic,
        cardiac_issue,
        blood_pressure,
      };
  
      const { userid: id, admin: is_admin } = req.user;
  
      const isValidPatient = await checkUserWithPatientID(id, patient_id);
  
      if (isValidPatient || is_admin) {
        await updatePersonalDetails(data, patient_id);
  
        res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
          new ResponseHandler(SUCCESS_MESSAGE.UPDATE_INFO_SUCCESS_MESSAGE)
        );
      } else {
        throw UNAUTHORIZED_ACCESS;
      }
    } catch (error) {
      next(error)
    }
  };
  
  const deletePersonalInfo = async (req, res, next) => {
    try {
      const { userid: id, admin: is_admin } = req.user;
      const { patient_id } = req.params;
  
      const isValidPatient = await checkUserWithPatientID(id, patient_id);
      if (isValidPatient || is_admin) {
        await deletePersonalDetails(patient_id);
      
        res.status(SUCCESS_STATUS_CODE.SUCCESS).send(
          new ResponseHandler(SUCCESS_MESSAGE.DELETE_SUCCESS_MESSAGE)
        );
          }
      throw NOT_DELETED;
    } catch (error) {
      next(error)
    }
  };

  export default {addDoctor}