import Joi from "joi";

const user_schemas = {
  createUserSchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .error(new Error("email is required and must be a valid email")),

    user_password: Joi.string()
      .min(4)
      .required()
      .error(
        new Error("user_password is required and must be at least 4 characters")
      ),

    first_name: Joi.string()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .error(
        new Error("first_name is required and must have a minimum length of 3")
      ),

    last_name: Joi.string()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .error(
        new Error("last_name is required and must have a minimum length of 3")
      ),

    mobile_number: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .error(new Error("mobile_number is required and must be 10 digits")),
      userCode:Joi.string().optional()
  }),

  userLoginSchema: Joi.object({
    email: Joi.string()
      .email()
      .optional()
      .error(new Error("email is optional and if enter then must be a valid email")),
      userCode: Joi.string()
      .optional()
      .error(new Error("userCode is opitonal")),
    user_password: Joi.string()
      .min(4)
      .optional()
      .error(
        new Error("user_password is required and must be at least 4 characters")
      ),
      newPassword: Joi.string()
      .min(4)
      .optional()
  }),

  updateUserSchema: Joi.object({

    first_name: Joi.string()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .error(
        new Error("first_name is required and must have a minimum length of 3")
      ),

    last_name: Joi.string()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .error(
        new Error("last_name is required and must have a minimum length of 3")
      ),

    mobile_number: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .error(new Error("mobile_number is required and must be 10 digits")),
  }),

  createPersonalInfo: Joi.object({
    patient_name: Joi.string()
      .required()
      .error(new Error("patient name is required")),
    date_of_birth: Joi.date()
      .required()
      .error(new Error("date_of_birth is required and must be a valid date")),
    gender: Joi.string()
      .required()
      .error(
        new Error(
          "gender is required field"
        )
      ),
    weight: Joi.number()
      .positive()
      .optional()
      .error(new Error("weight must be a positive number")),

    height: Joi.string()
      .pattern(/^\d+(\.\d{1,2})?$/)
      .optional()
      .error(new Error("height must be a valid number, e.g., 5.2")),

    country_of_origin: Joi.string()
      .optional()
      .error(new Error("country_of_origin is required")),

    is_diabetic: Joi.boolean()
      .optional()
      .error(new Error("is_diabetic must be a boolean")),

    cardiac_issue: Joi.boolean()
      .optional()
      .error(new Error("cardiac_issue must be a boolean")),

    blood_pressure: Joi.boolean()
      .optional()
      .error(new Error("blood_pressure must be a boolean")),
  }),

  updatePersonalInfo: Joi.object({
    patient_id: Joi.number().required(),
    age: Joi.number(),
    bmi: Joi.number(),
    patient_name: Joi.string()
      .required()
      .error(new Error("patient name is required")),
    gender: Joi.string()
      .required()
      .error(
        new Error(
          "gender is required field "
        )
      ),
    date_of_birth: Joi.date()
      .required()
      .error(new Error("date_of_birth is required and must be a valid date")),

    weight: Joi.number()
      .positive()
      .optional()
      .error(new Error("weight must be a positive number")),

    height: Joi.number()
      .positive()
      .optional()
      .messages({ "number.positive": "Height must be a valid number, e.g., 5.2" }),

    country_of_origin: Joi.string()
      .optional()
      .error(new Error("country_of_origin is required")),

    is_diabetic: Joi.valid(1, 0, true, false)
      .optional()
      .error(new Error("is_diabetic must be a boolean")),

    cardiac_issue: Joi.valid(1, 0, true, false)
      .optional()
      .error(new Error("cardiac_issue must be a boolean")),

    blood_pressure: Joi.valid(1, 0, true, false)
      .optional()
      .error(new Error("blood_pressure must be a boolean")),
  }),


  createFamilyInfo: Joi.object({
    familyDetails: Joi.object({
      patient_id: Joi.number().required(),
      father_name: Joi.string().min(3).max(100).optional().error(new Error("father_name is required and must be at least 3 characters")),
      father_age: Joi.number().min(18).optional().error(new Error("father_age is required")),
      father_country_origin: Joi.string().min(3).max(25).optional().error(new Error("father_country_origin is required")),
      mother_name: Joi.string().min(3).max(100).optional().error(new Error("mother_name is required and must be at least 3 characters")),
      mother_age: Joi.number().min(18).optional().error(new Error("mother_age is required")),
      mother_country_origin: Joi.string().min(3).max(25).optional().error(new Error("mother_country_origin is required")),
      mother_diabetic: Joi.boolean().optional().error(new Error("mother_diabetic is required")),
      mother_cardiac_issue: Joi.boolean().optional().error(new Error("mother_cardiac_issue is required")),
      mother_bp: Joi.boolean().error(new Error("mother_bp is required field")),
      father_diabetic: Joi.boolean().optional().error(new Error("father_diabetic is required")),
      father_cardiac_issue: Joi.boolean().optional().error(new Error("father_cardiac_issue is required")),
      father_bp: Joi.boolean().error(new Error("father_bp is required field")),
    }).required()
  }),

  updateFamilyInfo: Joi.object({
    patient_id: Joi.number().required(),
    father_name: Joi.string()
      .min(3)
      .max(100)
      .error(new Error("father_name must be at least 3 characters")),
    father_age: Joi.number().min(18).error(new Error("father_age is min 18")),
    father_country_origin: Joi.string().min(3).max(25).error(new Error("father_country_origin is string format and minimum 3 character are allowed")),
    mother_name: Joi.string().min(3).max(100).error(new Error("mother_name is string format and must be at least 3 characters")),
    mother_age: Joi.number().min(18).error(new Error("father_age is min 18")),
    mother_country_origin: Joi.string().min(3).max(25).error(new Error("father_country_origin is minimum 3 character")),
    mother_diabetic: Joi.boolean().valid(1, 0, true, false).optional().error(new Error("mother_diabetic is required")),
    mother_cardiac_issue: Joi.boolean().valid(1, 0, true, false).optional().error(new Error("mother_cardiac_issue is required")),
    mother_bp: Joi.boolean().valid(1, 0, true, false).error(new Error("mother_bp is required field")),
    father_diabetic: Joi.boolean().valid(1, 0, true, false).optional().error(new Error("father_diabetic is required")),
    father_cardiac_issue: Joi.boolean().valid(1, 0, true, false).optional().error(new Error("father_cardiac_issue is required")),
    father_bp: Joi.boolean().valid(1, 0, true, false).error(new Error("father_bp is required field")),
  }),
  createDiseaseInfo: Joi.object({
    diseaseDetails: Joi.object({
      patient_id: Joi.number().required().error(new Error("patient_id is required")),
      disease_type: Joi.string().required().error(new Error("disease_type is required")),
      disease_description: Joi.string().required().error(new Error("disease_description is required"))
    }).required()
  }),
  updateDiseaseInfo: Joi.object({
    patient_id: Joi.number().required(),
    disease_type: Joi.string().optional().error(new Error("disease_type is in string format")),
    disease_description: Joi.string().max(255).optional().error(new Error("disease_type is in string format")),
  }),

  doctorSchema: Joi.object({
    doctor_id: Joi.number().integer().positive().optional(),
    name: Joi.string().max(255).required(),
    specialization: Joi.string().max(100).optional(),
    contact_number: Joi.string().max(15).optional(),
    email: Joi.string().email().max(100).optional(),
    user_id: Joi.number().integer().positive().optional()
  }),
  appointmentSchema: Joi.object({
    appointment_id: Joi.number().integer().positive().optional(),
    appointment_date: Joi.date().required(),
    appointment_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required(),
    status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').default('Scheduled'),
    patient_id: Joi.number().integer().positive().required(),
    doctor_id: Joi.number().integer().positive().required()
  }),
  changeStatus: Joi.object({
    status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled', 'Pending').default('Pending').error(
      new Error("Status are allowed only'Scheduled', 'Completed', 'Cancelled','Pending")
    ),
  }),

 cancelledAppointmentSchema: Joi.object({
  reason: Joi.string().required().error(new Error("reason is required"))
})

};



export { user_schemas};
