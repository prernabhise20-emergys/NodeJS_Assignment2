import {
  ERROR_STATUS_CODE,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  SUCCESS_STATUS_CODE,
} from "../constants/statusConstant.js";
import { MessageHandler } from "../utility/handlers.js";

const { SERVER_ERROR, BAD_REQUEST, INVALID, NOT_FOUND, FORBIDDEN } =
  ERROR_STATUS_CODE;
const { CREATED, SUCCESS } = SUCCESS_STATUS_CODE;
const {
  UNAUTHORIZED_ACCESS_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  ALREADY_REGISTER,
  INVALID_USER_MESSAGE,
  USER_NOT_FOUND,
  CANNOT_DELETE,
  NOT_DELETE_MESSAGE,
  NOT_UPDATE_MESSAGE,
  NO_FILE,
  MISSING_REQUIRED,
} = ERROR_MESSAGE;
const {
  LOGIN_SUCCESS_MESSAGE,
  REGISTER_SUCCESS,
  ADD_ADMIN,
  REMOVE_ADMIN,
  USER_UPDATE_SUCCESS_MSG,
  UPDATE_INFO_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  ADDED_FAMILY_MESSAGE,
  CREATED_DISEASE_INFO_MESSAGE,
} = SUCCESS_MESSAGE;

export const AUTH_RESPONSES = {
  LOGIN_USER: new MessageHandler(SUCCESS, LOGIN_SUCCESS_MESSAGE),
  INTERNAL_SERVER_ERROR: new MessageHandler(
    SERVER_ERROR,
    ERROR_MESSAGE.SERVER_ERROR_MESSAGE
  ),
  USER_EXISTS: new MessageHandler(BAD_REQUEST, ALREADY_REGISTER),
  REGISTER_SUCCESS: new MessageHandler(CREATED, REGISTER_SUCCESS),
  INVALID_USER: new MessageHandler(INVALID, INVALID_USER_MESSAGE),
  ADD_ADMINS: new MessageHandler(SUCCESS, ADD_ADMIN),
  REMOVE_ADMIN: new MessageHandler(SUCCESS, REMOVE_ADMIN),
  USER_UPDATE: new MessageHandler(SUCCESS, USER_UPDATE_SUCCESS_MSG),
  USER_NOT_FOUND: new MessageHandler(NOT_FOUND, USER_NOT_FOUND),
  CANNOT_DELETE_USER: new MessageHandler(INVALID, CANNOT_DELETE),
  UNAUTHORIZED_ACCESS: new MessageHandler(INVALID, UNAUTHORIZED_ACCESS_MESSAGE),
  FORBIDDEN: new MessageHandler(FORBIDDEN, FORBIDDEN_ERROR_MESSAGE),
  UPDATE_SUCCESSFULLY: new MessageHandler(SUCCESS, UPDATE_INFO_SUCCESS_MESSAGE),
  NOT_DELETED: new MessageHandler(BAD_REQUEST, NOT_DELETE_MESSAGE),
  DELETE_SUCCESSFULLY: new MessageHandler(SUCCESS, DELETE_SUCCESS_MESSAGE),
  ADD_FAMILY_SUCCESSFULLY: new MessageHandler(CREATED, ADDED_FAMILY_MESSAGE),
  NOT_UPDATE: new MessageHandler(BAD_REQUEST, NOT_UPDATE_MESSAGE),
  ADD_DISEASE_INFO: new MessageHandler(CREATED, CREATED_DISEASE_INFO_MESSAGE),
  NO_FILE_FOUND: new MessageHandler(NOT_FOUND, NO_FILE),
  MISSING_REQUIRED: new MessageHandler(NOT_FOUND, MISSING_REQUIRED),
};
