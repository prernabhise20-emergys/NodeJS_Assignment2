import db from "../db/connection.js";

const getInfo = async (is_admin, limit, offset) => {
  try {
    if (!is_admin) {
      throw new Error("Unauthorized access");
    }

    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          p.patient_id,p.patient_name, u.mobile_number, 
          p.date_of_birth, p.age, p.weight, p.height, p.bmi, 
          p.country_of_origin, p.is_diabetic, p.cardiac_issue, p.blood_pressure, 
          f.father_name, f.father_age, f.mother_name, f.mother_age, 
          f.father_country_origin, f.mother_country_origin, 
          f.parent_diabetic, f.parent_cardiac_issue, f.parent_bp, 
          d.disease_type, d.disease_description, 
          do.document_type, do.document_url  
        FROM personal_info p 
        JOIN user_register u ON p.user_id = u.id 
        LEFT JOIN family_info f ON f.patient_id = p.patient_id AND f.is_deleted = FALSE
        LEFT JOIN disease d ON d.patient_id = p.patient_id AND d.is_deleted = FALSE
        LEFT JOIN documents do ON do.patient_id = p.patient_id AND do.is_deleted = FALSE
        WHERE p.is_deleted = FALSE ORDER BY p.patient_id LIMIT ? OFFSET ?
      `;

      db.query(query,[limit,offset], (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  } catch (error) {
    throw error;
  }
};

const getPatientInfo = async (id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT p.patient_id, p.patient_name, r.first_name, r.last_name, r.mobile_number, 
                p.date_of_birth, p.age, p.weight, p.height, p.bmi, p.country_of_origin, 
                p.is_diabetic, p.cardiac_issue, p.blood_pressure, f.father_name, f.father_age, 
                f.mother_name, f.mother_age, f.father_country_origin, f.mother_country_origin, 
                f.parent_diabetic, f.parent_cardiac_issue, f.parent_bp, d.disease_type, 
                d.disease_description, do.document_type, do.document_url 
        FROM personal_info p 
        JOIN user_register r ON p.user_id = r.id 
        JOIN family_info f ON f.patient_id = p.patient_id 
        JOIN disease d ON d.patient_id = p.patient_id 
        JOIN documents do ON do.patient_id = p.patient_id 
        WHERE p.is_deleted = false 
          AND f.is_deleted = false 
          AND d.is_deleted = false 
          AND do.is_deleted = false 
          AND r.id = ?`,
        id,
        (error, result) => {
          if (error) {
            return reject(error);
          }

          const patientData = {};

          result.forEach((row) => {
            if (!patientData[row.patient_id]) {
              patientData[row.patient_id] = {
                patient_id: row.patient_id,
                patient_name: row.patient_name,
                first_name: row.first_name,
                last_name: row.last_name,
                mobile_number: row.mobile_number,
                date_of_birth: row.date_of_birth,
                age: row.age,
                weight: row.weight,
                height: row.height,
                bmi: row.bmi,
                country_of_origin: row.country_of_origin,
                is_diabetic: row.is_diabetic,
                cardiac_issue: row.cardiac_issue,
                blood_pressure: row.blood_pressure,
                father_name: row.father_name,
                father_age: row.father_age,
                mother_name: row.mother_name,
                mother_age: row.mother_age,
                father_country_origin: row.father_country_origin,
                mother_country_origin: row.mother_country_origin,
                parent_diabetic: row.parent_diabetic,
                parent_cardiac_issue: row.parent_cardiac_issue,
                parent_bp: row.parent_bp,
                disease_type: row.disease_type,
                disease_description: row.disease_description,
                documents: [],
              };
            }

            patientData[row.patient_id].documents.push({
              document_type: row.document_type,
              document_url: row.document_url,
            });
          });

          const patientInfo = Object.values(patientData);

          return resolve(patientInfo);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const getPersonalInfo = async (patient_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM personal_info WHERE is_deleted=false and patient_id = ?",
        [patient_id],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const createPersonalDetails = async (data, userId, email) => {
  try {
    const today = new Date();
    const {
      patient_name,
      date_of_birth,
      gender,
      height,
      weight,
      is_diabetic,
      cardiac_issue,
      blood_pressure,
      country_of_origin,
    } = data;

    const userAge = today.getFullYear() - new Date(date_of_birth).getFullYear();
    let userBMI = weight / (height * height);

    data = {
      patient_name: patient_name,
      gender: gender,
      user_id: userId,
      created_by: email,
      updated_by: email,
      age: userAge,
      bmi: userBMI,
      date_of_birth: date_of_birth,
      weight: weight,
      height: height,
      country_of_origin: country_of_origin,
      is_diabetic: is_diabetic,
      cardiac_issue: cardiac_issue,
      blood_pressure: blood_pressure,
    };

    return new Promise((resolve, reject) => {
      db.query("INSERT INTO personal_info SET ?", [data], (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  } catch (error) {
    throw error;
  }
};

const updatePersonalDetails = async (data, patient_id) => {
  try {
    const values = [
      data.patient_name,
      data.date_of_birth,
      data.gender,
      data.height,
      data.weight,
      data.is_diabetic,
      data.cardiac_issue,
      data.blood_pressure,
      data.country_of_origin,
      patient_id,
    ];
    console.log(values);
    // if (is_admin)
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE personal_info SET patient_name=?, date_of_birth = ?,gender=?, height = ?, weight = ?, is_diabetic = ?, cardiac_issue = ?, blood_pressure = ?, country_of_origin = ? WHERE patient_id = ?",
        values,
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};
const deletePersonalDetails = async (patient_id) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE personal_info SET IS_DELETED = TRUE WHERE patient_id = ?",
        [patient_id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result.affectedRows === 0) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const insertFamilyInfo = async (data) => {
  try {
    const {
      father_name,
      father_age,
      father_country_origin,
      mother_name,
      mother_age,
      mother_country_origin,
      parent_diabetic,
      parent_cardiac_issue,
      parent_bp,
      patient_id,
    } = data;

    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO family_info SET ?",
        {
          father_name,
          father_age,
          father_country_origin,
          mother_name,
          mother_age,
          mother_country_origin,
          parent_diabetic,
          parent_cardiac_issue,
          parent_bp,
          patient_id,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const checkFillForm = async (userId) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM personal_info WHERE user_id=?",
        userId,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    return result.length <= 0;
  } catch (error) {
    throw error;
  }
};

const getFamilyInfo = async (patient_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM family_info WHERE is_deleted=false and patient_id = ?",
        [patient_id],
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};
const updateFamilyInfo = async (data, patient_id) => {
  try {
    const values = [
      data.father_name,
      data.father_age,
      data.father_country_origin,
      data.mother_name,
      data.mother_age,
      data.mother_country_origin,
      data.parent_diabetic,
      data.parent_cardiac_issue,
      data.parent_bp,
      patient_id,
    ];

    return new Promise((resolve, reject) => {
      db.query(
        " UPDATE family_info SET father_name = ?, father_age = ?, father_country_origin = ?, mother_name = ?,  mother_age = ?, mother_country_origin = ?, parent_diabetic = ?,  parent_cardiac_issue = ?, parent_bp = ? WHERE patient_id = ?",
        values,
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const deleteFamilyInfo = async (patient_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE family_info SET IS_DELETED = TRUE WHERE patient_id = ?",
        patient_id,
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const getDiseaseInfo = async (patient_id) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query( "SELECT * FROM disease d WHERE is_deleted = false and patient_id = ?",
        patient_id,
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
    });

    return data;
  } catch (error) {
    throw error;
  }
};


const addDiseaseData = async (data) => {
  try {
    const { disease_type, disease_description, patient_id } = data;

    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO disease SET ?",
        { disease_type, disease_description, patient_id },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const updateDiseaseDetails = async (formData, patient_id) => {
  try {
    const { disease_type, disease_description } = formData;
    const user = { disease_type, disease_description };
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE disease SET ? WHERE patient_id = ?",
        [formData, patient_id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const deleteDiseaseDetails = async (patient_id) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE disease SET IS_DELETED = TRUE WHERE patient_id = ?",
        patient_id,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const getUploadInfo = async (patient_id) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query( "SELECT * FROM documents WHERE is_deleted = false and patient_id = ?",
        patient_id,
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
    });

    return data;
  } catch (error) {
    throw error;
  }
};


const saveDocument = (documentData) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO documents (document_type, document_url, patient_id) VALUES (?, ?, ?)",
      [
        documentData.document_type,
        documentData.document_url,
        documentData.patient_id,
      ],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

// *************************************************************************************

const checkPersonalInfo = async (userId) => {
  try {
    const personalInfo = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM personal_info WHERE user_id = ?",
        [userId],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });
    return personalInfo.length > 0;
  } catch (error) {
    throw error;
  }
};

// *************************************

const checkFamilyInfo = async (userId) => {
  try {
    const familyInfo = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM family_info WHERE user_id = ?",
        [userId],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });
    return familyInfo.length > 0;
  } catch (error) {
    throw error;
  }
};

// *******************************************************

const checkDiseaseInfo = async (userId) => {
  try {
    const diseaseInfo = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM disease WHERE user_id = ?",
        [userId],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });
    return diseaseInfo.length > 0;
  } catch (error) {
    throw error;
  }
};

const checkDocumentExists = (document_type, patient_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT 1 FROM documents WHERE is_deleted=false and document_type = ? AND patient_id = ? LIMIT 1`,
      [document_type, patient_id],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.length > 0);
      }
    );
  });
};

const modifyDocument = (documentData) => {
  return new Promise((resolve, reject) => {
    const values = [
      documentData.document_type,
      documentData.document_url || null,
      documentData.patient_id,
    ];
    db.query(
      `UPDATE documents SET document_type = ?, document_url = ? WHERE patient_id = ?`,
      values,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};



const removeDocument = (patient_id, document_type) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE documents SET IS_DELETED = ? WHERE patient_id = ? AND document_type = ?";
    const values = [true, patient_id, document_type];

    db.query(query, values, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

export {
  getFamilyInfo,
  checkDocumentExists,
  getDiseaseInfo,
  modifyDocument,
  removeDocument,
  saveDocument,
  createPersonalDetails,
  checkPersonalInfo,
  checkFamilyInfo,
  getPersonalInfo,
  checkDiseaseInfo,
  updatePersonalDetails,
  getInfo,
  getPatientInfo,
  deletePersonalDetails,
  checkFillForm,
  insertFamilyInfo,
  updateFamilyInfo,
  deleteFamilyInfo,
  addDiseaseData,
  updateDiseaseDetails,
  getUploadInfo,
  deleteDiseaseDetails,
};
