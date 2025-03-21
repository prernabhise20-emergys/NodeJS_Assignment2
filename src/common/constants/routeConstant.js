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
  DELETE_DOCUMENT:"/deleteDocument"
};

export default ROUTE_CONSTANTS;
