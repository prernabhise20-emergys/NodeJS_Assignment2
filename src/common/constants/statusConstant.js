const ERROR_STATUS_CODE = {
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INVALID: 401,
  DUPLICATE: 409,
  FORBIDDEN: 403
};
const SUCCESS_STATUS_CODE = {
  CREATED: 201,
  SUCCESS: 200
 
};
const ERROR_MESSAGE = {
  MORE_THAN_LIMIT:"Only 4 documents allow to upload",
  ID_ALREADY_EXISTS:"Patient_id already exists",
  CANNOT_DELETE:"Cannot delete the last admin user",
  USER_NOT_FOUND:"User not found",
  SERVER_ERROR_MESSAGE: "Internal Server Error",
  INVALID_TOKEN_MESSAGE: "Invalid token.",
  INVALID_USER_MESSAGE: "Invalid User",
  FORBIDDEN_ERROR_MESSAGE: "Failed to authenticate token",
  UNAUTHORIZED_ACCESS_MESSAGE: "Unauthorized access",
  NOT_UPDATE_MESSAGE: "Failed to update information",
  NOT_DELETE_MESSAGE: "Failed to delete information",
  NO_FILE: "No file uploaded",
  MISSING_REQUIRED: "Missing required fields",
  ALREADY_REGISTER: "User already exists",
  DISEASE_STEP:"Please fill disease info first.",
  FAMILY_STEP:"Please fill family info next.",
  PERSONAL_INFO_EXISTS:"Personal information is already exist, if you want to change then update the information",
  FAMILY_INFO_EXISTS:"Family information is already exists, if you want to change then update the information",
  DISEASE_INFO_EXISTS:"Disease information is already exists, if you want to change then update the information",
  FORBIDDEN_MESSAGE:"Unauthorized access",
  DOCUMENT_NOT_FOUND:"Document not found"
};

const SUCCESS_MESSAGE={
  USER_DELETED:"This user is deleted, if you want login then signup the user",
  ADD_ADMIN:"Set as a admin successfully",
  DOCUMENT_DELETED:"Document deleted successfully",
  REMOVE_ADMIN:"Removed as a admin successfully",
  ADMIN_LOGIN:"Admin login",
  LOGIN_SUCCESS_MESSAGE: "Login successfully",
  USER_UPDATE_SUCCESS_MSG: "User credentials updated successfully",
  RETRIEVE_INFO_SUCCESS_MESSAGE: "Patient details are retrieved successfully",
  ADDED_PERSONAL_INFO_MESSAGE: "Personal information added successfully",
  UPDATE_INFO_SUCCESS_MESSAGE: "Information updated successfully",
  DELETE_SUCCESS_MESSAGE: "Information deleted successfully",
  ADDED_FAMILY_MESSAGE: "Added family info successfully",
  GET_FAMILY_INFO_MESSAGE: "Family information retrieved successfully",
  DISEASE_DETAILS: "Disease details retrieved successfully",
  CREATED_DISEASE_INFO_MESSAGE: "Disease info added successfully",
  DOCUMENT_UPLOAD: "Document uploaded successfully",
  REGISTER_SUCCESS: "User registered successfully. Verification email sent.",

}
export { ERROR_STATUS_CODE,SUCCESS_STATUS_CODE, ERROR_MESSAGE,SUCCESS_MESSAGE };
