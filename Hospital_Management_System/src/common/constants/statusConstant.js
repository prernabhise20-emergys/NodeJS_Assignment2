const STATUS_CODE = {
  CREATED: 201,
  SUCCESS: 200,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INVALID: 401,
  DUPLICATE: 409,
  FORBIDDEN: 403,
};

const MESSAGE = {
  ADMIN_LOGIN:"Admin login",
  SERVER_ERROR_MESSAGE: "Internal Server Error",
  INVALID_TOKEN_MESSAGE: "Invalid token.",
  INVALID_USER_MESSAGE: "Invalid User",
  LOGIN_SUCCESS_MESSAGE: "Login successfully",
  USER_UPDATE_SUCCESS_MSG: "User update successfully",
  FORBIDDEN_ERROR_MESSAGE: "Failed to authenticate token",
  UNAUTHORIZED_ACCESS_MESSAGE: "Unauthorized access",
  RETRIEVE_INFO_SUCCESS_MESSAGE: "Patient details are retrieved successfully",
  ADDED_PERSONAL_INFO_MESSAGE: "Personal information added successfully",
  NOT_UPDATE_MESSAGE: "Failed to update information",
  UPDATE_INFO_SUCCESS_MESSAGE: "Update the information successfully",
  NOT_DELETE_MESSAGE: "Failed to delete information",
  DELETE_SUCCESS_MESSAGE: "Information deleted successfully",
  ADDED_FAMILY_MESSAGE: "Added family info successfully",
  GET_FAMILY_INFO_MESSAGE: "Family information retrieved successfully",
  DISEASE_DETAILS: "Disease details retrieved successfully",
  CREATED_DISEASE_INFO_MESSAGE: "Disease info added successfully",
  NO_FILE: "No file uploaded",
  MISSING_REQUIRED: "Missing required fields",
  DOCUMENT_UPLOAD: "Document uploaded successfully",
  ALREADY_REGISTER: "User already exists",
  REGISTER_SUCCESS: "User registered successfully. Verification email sent.",
  DISEASE_STEP:"Please fill disease info first.",
  FAMILY_STEP:"Please fill family info next.",
  PERSONAL_INFO_EXISTS:"Personal information is already exist, if you want to change then update the information",
  FAMILY_INFO_EXISTS:"Family information is already exists, if you want to change then update the information",
  DISEASE_INFO_EXISTS:"Disease information is already exists, if you want to change then update the information",
  FORBIDDEN_MESSAGE:"Unauthorized access"
};

export { STATUS_CODE, MESSAGE };
