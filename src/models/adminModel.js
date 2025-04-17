import db from "../db/connection.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
const { UNAUTHORIZED_ACCESS } = AUTH_RESPONSES;

const getInfo = async (is_admin, limit, offset) => {
  try {
    if (!is_admin) {
      throw UNAUTHORIZED_ACCESS;
    }

    return new Promise((resolve, reject) => {
      db.query(
        `
 SELECT 
          p.patient_id, p.patient_name, p.gender, u.mobile_number, 
          p.date_of_birth, p.age, p.weight, p.height, p.bmi, 
          p.country_of_origin, p.is_diabetic, p.cardiac_issue, p.blood_pressure, 
          f.father_name, f.father_age, f.mother_name, f.mother_age, 
          f.father_country_origin, f.mother_country_origin, 
          f.mother_diabetic, f.mother_cardiac_issue, f.mother_bp, 
          f.father_diabetic, f.father_cardiac_issue, f.father_bp, 
          d.disease_type, d.disease_description, 
          do.document_type, do.document_url  
        FROM 
          personal_info p 
        JOIN 
          user_register u ON p.user_id = u.id 
        JOIN 
          family_info f ON f.patient_id = p.patient_id 
        JOIN 
          disease d ON d.patient_id = p.patient_id 
        JOIN 
          documents do ON do.patient_id = p.patient_id 
        WHERE 
          p.is_deleted = FALSE 
        ORDER BY 
          p.patient_id 
        LIMIT ? OFFSET ?`,
        [limit, offset],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          const patientData = [];

          result.forEach((row) => {
            let existing = patientData.find(
              (item) => item.patient_id === row.patient_id
            );

            if (!existing) {
              const { document_type, document_url, ...data } = row;
              existing = {
                ...data,
                documents: [],
              };
              patientData.push(existing);
            }
            existing.documents.push({
              document_type: row.document_type,
              document_url: row.document_url,
            });
          });

          return resolve(patientData);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const getTotalCount = async (is_admin) => {
  try {
    if (!is_admin) {
      throw UNAUTHORIZED_ACCESS;
    }

    return new Promise((resolve, reject) => {
      db.query(
        `SELECT COUNT(*) AS total FROM personal_info p
         JOIN family_info f ON f.patient_id = p.patient_id
         JOIN disease d ON d.patient_id = p.patient_id
         WHERE p.is_deleted = FALSE 
         AND f.is_deleted = FALSE 
         AND d.is_deleted = FALSE `,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result[0].total);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const deletePatientDetails = async (patient_id) => {
  try {
    const data = await new Promise((resolve, reject) => {

      db.query(
        `          
  UPDATE personal_info p
  JOIN family_info f 
  ON p.patient_id = f.patient_id
  JOIN disease d 
  ON p.patient_id = d.patient_id
  JOIN documents doc 
  ON p.patient_id = doc.patient_id
  SET p.is_deleted = TRUE, f.is_deleted = TRUE, d.is_deleted = TRUE, doc.is_deleted = TRUE
  WHERE p.patient_id =?  and f.patient_id=? and d.patient_id=? and doc.patient_id=?;`,
        [patient_id, patient_id, patient_id, patient_id],
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

const ageGroupWiseData = (is_admin) => {
  return new Promise((resolve, reject) => {
    if (is_admin) {
      db.query(
        `
    SELECT 
    COUNT(age) AS count,
    CASE 
        WHEN age BETWEEN 0 AND 12 THEN 'child'
        WHEN age BETWEEN 13 AND 18 THEN 'teen'
        WHEN age BETWEEN 19 AND 60 THEN 'adult'
        WHEN age > 60 THEN 'older'
    END AS ageGroup
FROM personal_info p 
JOIN user_register u ON p.user_id = u.id 
JOIN family_info f ON f.patient_id = p.patient_id 
JOIN disease d ON d.patient_id = p.patient_id 
JOIN documents do ON do.patient_id = p.patient_id 
WHERE 
    p.is_deleted = false 
    AND f.is_deleted = false 
    AND u.is_deleted = false 
    AND d.is_deleted = false 
    AND do.is_deleted = false
GROUP BY ageGroup;

    `,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    } else {
      throw UNAUTHORIZED_ACCESS;
    }
  });
};

const addAsAdmin = async (isAdmin, email) => {
  try {
    if (isAdmin) {
      return new Promise((resolve, reject) => {
        db.query(
          "update user_register set is_admin=true where email=?",
          email,
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
    }
  } catch (error) {
    throw error;
  }
};

// **********************************************************

const removeAdminAuthority = async (isAdmin, email) => {
  try {
    if (isAdmin) {
      return new Promise((resolve, reject) => {
        db.query(
          "update user_register set is_admin=false where is_deleted=false and email=?",
          email,
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
    }
  } catch (error) {
    throw error;
  }
};


const checkAdminCount = async () => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) AS adminCount FROM user_register WHERE is_admin = true AND is_deleted = false",
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results[0].adminCount);
        }
      );
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const checkSuperAdmin = async (email) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT is_superadmin FROM user_register WHERE email = ?",
        email, 
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results[0]?.is_superadmin); 
        }
      );
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const displayAdmin = async () => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT email FROM user_register WHERE is_admin = true AND is_superadmin=false and is_deleted = false",
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
const createDoctorData = async (data) => {
  try {
    let doctorData = { ...data };
console.log('doctor data',doctorData);

    return new Promise((resolve, reject) => {
      db.query("INSERT INTO doctors SET?", doctorData, (error, result) => {
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


const deleteDoctorData = async (doctor_id) => {

  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE doctors SET is_deleted = TRUE WHERE doctor_id = ?",
        doctor_id,
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


const changeStatus = async (status, appointment_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE appointments SET status = ? WHERE appointment_id = ?`,
        [status, appointment_id],
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


const scheduleAppointment = async (appointment_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE appointments SET status ='Scheduled' WHERE appointment_id = ?`,
        appointment_id,
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

const displayRequest = async () => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        `select a.appointment_id,p.patient_name,p.gender,p.age,d.disease_type,a.appointment_date,a.appointment_time,a.status,do.name 
      from appointments a join personal_info p 
      on(a.patient_id=p.patient_id)
      join disease d
      on(d.patient_id=p.patient_id)
      join doctors do 
      on(a.doctor_id=do.doctor_id)
      where p.is_deleted=false and a.status='Pending'`,
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
const getPatientData = async (appointment_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT p.patient_name, a.appointment_date, a.appointment_time, d.name
         FROM personal_info p 
         JOIN appointments a ON (p.patient_id = a.patient_id)
         JOIN doctors d ON (a.doctor_id = d.doctor_id)
         WHERE a.appointment_id = ?`,
        [appointment_id],
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

const getAllAppointmentInformation = async (doctor_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
    select a.appointment_id,p.patient_name,p.gender,p.age,d.disease_type,a.appointment_date,a.appointment_time,a.status 
      from appointments a join personal_info p 
      on(a.patient_id=p.patient_id)
      join disease d
      on(d.patient_id=p.patient_id)
      where p.is_deleted=false and doctor_id=? order by appointment_id;
      `, doctor_id,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
}


const getAllPatientAppointment = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT 
        a.appointment_id, 
        p.patient_name, 
        p.gender, 
        p.age, 
        d.disease_type, 
        DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date, 
        a.appointment_time, 
        a.status, 
        do.name 
      FROM appointments a 
      JOIN personal_info p ON a.patient_id = p.patient_id 
      JOIN disease d ON d.patient_id = p.patient_id 
      JOIN doctors do ON a.doctor_id = do.doctor_id 
      WHERE p.is_deleted = FALSE 
      ORDER BY a.appointment_id`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const checkDoctor = async (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id,first_name,last_name,mobile_number FROM user_register WHERE email=?;`, email,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

 
 
const getAllEmailForAddAdmin = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      `select id,
        email,first_name,last_name from user_Register 
        where is_admin=false`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};
 
const getAllEmailForAddDoctor = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      `select id,
        email,first_name,last_name from user_Register 
        where is_doctor=false`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const setIsDoctor = async (user_id) => {
  try {
   
      return new Promise((resolve, reject) => {
        db.query(
          "update user_register set is_doctor=true where id=?",
          user_id,
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
    
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT id, first_name, last_name, mobile_number FROM user_register WHERE email = ?',
      [email],
      (error, result) => {
        if (error) {
          console.error('Error in getUserByEmail:', error);
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

const getUserRegisterDetails = async (userId) => {
  return new Promise((resolve, reject) => {
    try {
      db.query(
        'SELECT id, first_name, last_name, mobile_number, email FROM user_register WHERE id = ?',
        [userId], 
        (error, result) => {
          if (error) {
            console.error('Error fetching user details:', error);
            return reject(error);
          }
          resolve(result[0]);
        }
      );
    } catch (error) {
      console.error('Error in getUserRegisterDetails:', error);
      reject(error);
    }
  });
};



export {
  getUserRegisterDetails,
  checkSuperAdmin,
  getUserByEmail,
  setIsDoctor,
  getAllEmailForAddDoctor,
  getAllEmailForAddAdmin,
  checkDoctor,
  getAllPatientAppointment,
  getAllAppointmentInformation,
  getPatientData,
  displayRequest,
  scheduleAppointment,
  changeStatus,
  deleteDoctorData,
  createDoctorData,
  getInfo,
  displayAdmin,
  addAsAdmin,
  removeAdminAuthority,
  ageGroupWiseData,
  deletePatientDetails,
  getTotalCount,
  checkAdminCount,
};
