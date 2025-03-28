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
  }),

  userLoginSchema: Joi.object({
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
  }),

  updateUserSchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .error(new Error("email is required and must be a valid email")),

    user_password: Joi.string()
      .min(4)
      .required()
      .error(
        new Error("user_password is required and must be at least 6 characters")
      ),

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
      .valid("male", "female", "other")
      .error(
        new Error(
          "gender is required field and allowed this options male, female,other"
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
      .valid("male", "female", "other")
      .error(
        new Error(
          "gender is required field and allowed this options male, female,other"
        )
      ),
    date_of_birth: Joi.date()
      .required()
      .error(new Error("date_of_birth is required and must be a valid date")),

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

    is_diabetic: Joi.alternatives()
      .try(Joi.boolean(), Joi.number().valid(0, 1))
      .error(new Error("parent_diabetic is in boolean form")),
    cardiac_issue: Joi.alternatives()
      .try(Joi.boolean(), Joi.number().valid(0, 1))
      .error(new Error("parent_cardiac_issue is in boolean form")),
    blood_pressure: Joi.alternatives()
      .try(Joi.boolean(), Joi.number().valid(0, 1))
      .error(new Error("parent_bp is in boolean form")),
  }),

  createFamilyInfo: Joi.object({
    familyDetails: Joi.object({
      patient_id: Joi.number().required(),
      father_name: Joi.string()
        .min(3)
        .max(100)
        .optional()
        .error(
          new Error("father_name is required and must be at least 3 characters")
        ),
      father_age: Joi.number()
        .min(18)
        .optional()
        .error(new Error("father_age is required")),
      father_country_origin: Joi.string()
        .min(3)
        .max(25)
        .optional()
        .error(new Error("father_country_origin is required")),
      mother_name: Joi.string()
        .min(3)
        .max(100)
        .optional()
        .error(
          new Error("mother_name is required and must be at least 3 characters")
        ),
      mother_age: Joi.number()
        .min(18)
        .optional()
        .error(new Error("mother_age is required")),
      mother_country_origin: Joi.string()
        .min(3)
        .max(25)
        .optional()
        .error(new Error("mother_country_origin is required")),
      parent_diabetic: Joi.boolean()
        .optional()
        .error(new Error("parent_diabetic is required")),
      parent_cardiac_issue: Joi.boolean()
        .optional()
        .error(new Error("parent_cardiac_issue is required")),
      parent_bp: Joi.boolean().error(new Error("parent_bp is required field")),
    }).required(),
  }),

  updateFamilyInfo: Joi.object({
    patient_id: Joi.number().required(),
    father_name: Joi.string()
      .min(3)
      .max(100)
      .error(new Error("father_name must be at least 3 characters")),
    father_age: Joi.number().min(18).error(new Error("father_age is min 18")),
    father_country_origin: Joi.string()
      .min(3)
      .max(25)
      .error(
        new Error(
          "father_country_origin is string format and minimum 3 characters are allowed"
        )
      ),
    mother_name: Joi.string()
      .min(3)
      .max(100)
      .error(
        new Error(
          "mother_name is string format and must be at least 3 characters"
        )
      ),
    mother_age: Joi.number().min(18).error(new Error("mother_age is min 18")),
    mother_country_origin: Joi.string()
      .min(3)
      .max(25)
      .error(new Error("mother_country_origin is minimum 3 characters")),
    parent_diabetic: Joi.alternatives()
      .try(Joi.boolean(), Joi.number().valid(0, 1))
      .error(new Error("parent_diabetic is in boolean form")),
    parent_cardiac_issue: Joi.alternatives()
      .try(Joi.boolean(), Joi.number().valid(0, 1))
      .error(new Error("parent_cardiac_issue is in boolean form")),
    parent_bp: Joi.alternatives()
      .try(Joi.boolean(), Joi.number().valid(0, 1))
      .error(new Error("parent_bp is in boolean form")),
  }),
  createDiseaseInfo: Joi.object({
    diseaseDetails: Joi.object({
      patient_id: Joi.number().required(),
      disease_type: Joi.string().required(),
      disease_description: Joi.string().required(),
    }).required(),
  }),
  updateDiseaseInfo: Joi.object({
    patient_id: Joi.number().required(),
    disease_type: Joi.string()
      .optional()
      .error(new Error("disease_type is in string format")),
    disease_description: Joi.string()
      .max(255)
      .optional()
      .error(new Error("disease_type is in string format")),
  }),
};

export { user_schemas };
