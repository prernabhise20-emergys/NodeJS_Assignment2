import db from "../db/connection.js";

const getInfo = async ( is_admin, limit, offset) => {
  try {
  if (!is_admin) {
    throw new Error("Unauthorized access");
  }
else{
 
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT *  FROM personal_info p join user_Register r on(p.user_id=r.id) where is_deleted=false LIMIT ? OFFSET ?",
        [limit, offset],
        (error, result) => {
          if (error) {
            return reject(error);
          }
        
          return resolve(result);
        }
      );
    });
  
 }} catch (error) {
    throw error;
  }
};

const createPersonalDetails = async (data, userId, email) => {
  try {
    const today = new Date();
    const {
      date_of_birth,
      height,
      weight,
      is_diabetic,
      cardiac_issue,
      blood_pressure,
      country_of_origin,
    } = data;

    const userAge = today.getFullYear() - new Date(date_of_birth).getFullYear();
    let heightInMeters = height / 100;
    let userBMI = weight / (heightInMeters * heightInMeters);

    data = {
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


const updatePersonalDetails = async (data, userId) => {
  try {
    const values = [
      data.date_of_birth,
      data.height,
      data.weight,
      data.is_diabetic,
      data.cardiac_issue,
      data.blood_pressure,
      data.country_of_origin,
      userId,
    ];
    console.log(values);
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE personal_info SET date_of_birth = ?, height = ?, weight = ?, is_diabetic = ?, cardiac_issue = ?, blood_pressure = ?, country_of_origin = ? WHERE user_id = ?",
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

const deletePersonalDetails = async (id) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE user_register SET IS_DELETED = TRUE WHERE id = ?",
        [id],
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

const insertFamilyInfo = async (data, userId) => {
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
    } = data;

    const familyData = {
      father_name,
      father_age,
      father_country_origin,
      mother_name,
      mother_age,
      mother_country_origin,
      parent_diabetic,
      parent_cardiac_issue,
      parent_bp,
      user_id: userId,
    };

    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO family_info SET ?",
        [familyData],
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
const getFamilyInfo = async (userId) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM family_info WHERE user_id = ?",
        [userId],
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

const updateFamilyInfo = async (data, userId) => {
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
      userId,
    ];

    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE family_info SET father_name = ?, father_age = ?, father_country_origin = ?, mother_name = ?, mother_age = ?, mother_country_origin = ?, parent_diabetic = ?, parent_cardiac_issue = ?, parent_bp = ? WHERE user_id = ?",
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

const deleteFamilyInfo = async (userId) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM family_info WHERE user_id = ?",
        [userId],
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

const getDiseaseInfo = async ( admin) => {
  try {
    if(admin){
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM disease",
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
    });

    return data;
  }
  } catch (error) {
    throw error;
  }
};

const addDiseaseData = async (data, id) => {
  try {
    const { disease_type, disease_description } = data;

    data = {
      disease_type: disease_type,
      disease_description: disease_description,
      user_id: id,
    };

    return new Promise((resolve, reject) => {
      db.query("INSERT INTO disease SET?", [data], (error, result) => {
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

const updateDiseaseDetails = async (formData, id) => {
  try {
    const { disease_type, disease_description } = formData;
    const user = { disease_type, disease_description };
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE disease SET ? WHERE user_id = ?",
        [user, id],
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

const deleteDiseaseDetails = async (userId) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM disease WHERE user_id = ?",
        userId,
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

const saveDocument = (documentData,id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO documents (document_type, document_url, user_id) VALUES (?, ?, ?)",
      [
        documentData.document_type,
        documentData.document_url,
        id,
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

export {
  saveDocument,
  getDiseaseInfo,
  createPersonalDetails,
  checkPersonalInfo,
  checkFamilyInfo,
  checkDiseaseInfo,
  updatePersonalDetails,
  getInfo,
  deletePersonalDetails,
  checkFillForm,
  insertFamilyInfo,
  getFamilyInfo,
  updateFamilyInfo,
  deleteFamilyInfo,
  addDiseaseData,
  updateDiseaseDetails,
  deleteDiseaseDetails,
};
