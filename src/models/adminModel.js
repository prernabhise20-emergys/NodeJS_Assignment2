import db from "../db/connection.js";
import { AUTH_RESPONSES } from "../common/constants/response.js";
import bcrypt from "bcryptjs";
const { UNAUTHORIZED_ACCESS, PATIENT_ID_NOT_EXIST } = AUTH_RESPONSES;

const getInfo = async (is_admin, limit, offset) => {
  try {
    if (!is_admin) {
      throw UNAUTHORIZED_ACCESS;
    }

    const patients = await new Promise((resolve, reject) => {
      db.query(
        `
        SELECT 
          p.patient_id, p.patient_name, p.gender, u.mobile_number, 
          DATE_FORMAT(p.date_of_birth, '%Y-%m-%d') as date_of_birth,  
          p.age, p.weight, p.height, p.bmi, 
          p.country_of_origin, p.is_diabetic, p.cardiac_issue, p.blood_pressure, 
          f.father_name, f.father_age, f.mother_name, f.mother_age, 
          f.father_country_origin, f.mother_country_origin, 
          f.mother_diabetic, f.mother_cardiac_issue, f.mother_bp, 
          f.father_diabetic, f.father_cardiac_issue, f.father_bp
        FROM 
          personal_info p 
        LEFT JOIN 
          user_register u ON p.user_id = u.id 
        LEFT JOIN 
          family_info f ON f.patient_id = p.patient_id 
        WHERE 
          p.is_deleted = FALSE and u.is_deleted = FALSE
        ORDER BY 
          p.patient_id 
        LIMIT ? OFFSET ?
        `,
        [limit, offset],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });

    if (!patients.length) {
      return [];
    }

    const patientIds = patients.map((patient) => patient.patient_id);
    const documents = await new Promise((resolve, reject) => {
      db.query(
        `
        SELECT 
          document_type, document_url, patient_id
        FROM 
          documents
        WHERE 
          patient_id IN (?);`,
        [patientIds],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });

    const patientData = patients.map((patient) => {
      const patientDocuments = documents
        .filter((doc) => doc.patient_id === patient.patient_id)
        .map(({ document_type, document_url }) => ({ document_type, document_url }));

      return {
        ...patient,
        documents: patientDocuments,
      };
    });

    const limitedPatientData = patientData.slice(0, limit);
    return limitedPatientData;

  } catch (error) {
    throw error;
  }
};

const getTotalCount = async (is_admin) => {
  if (!is_admin) {
    throw UNAUTHORIZED_ACCESS;
  }

  return new Promise((resolve, reject) => {
    db.query(
      `
        SELECT COUNT(*) AS total 
        FROM personal_info 
        WHERE is_deleted = FALSE
      `,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result[0].total);
      }
    );
  });
};

const deletePatientDetails = async (patient_id) => {
  try {
    const exists = await new Promise((resolve, reject) => {
      db.query(
        `SELECT COUNT(*) AS count FROM personal_info WHERE patient_id = ? AND is_deleted = FALSE;`,
        [patient_id],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results[0].count > 0);
        }
      );
    });

    if (!exists) {
      throw PATIENT_ID_NOT_EXIST;
    }

    const data = await new Promise((resolve, reject) => {
      db.query(
        `          
        UPDATE personal_info p
        JOIN family_info f ON p.patient_id = f.patient_id
        JOIN disease d ON p.patient_id = d.patient_id
        JOIN documents doc ON p.patient_id = doc.patient_id
        SET p.is_deleted = TRUE, f.is_deleted = TRUE, d.is_deleted = TRUE, doc.is_deleted = TRUE
        WHERE p.patient_id =?;`,
        [patient_id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
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
        FROM personal_info p join
        user_register u ON p.user_id = u.id 
        JOIN 
          family_info f ON f.patient_id = p.patient_id 
       
     
        WHERE 
        p.is_deleted=false and u.is_deleted=false and f.is_deleted=false  
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
        "SELECT id,email,first_name, last_name FROM user_register WHERE is_admin = true AND is_superadmin=false and is_deleted = false",
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
const checkIfUserExists = async (email) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM user_register WHERE is_deleted=false and email= ?",
        [email],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    return result.length > 0;
  } catch (error) {
    throw error;
  }
};
const createDoctorData = async (data) => {
  try {
    const doctorData = { ...data };
    const { first_name, last_name, email, user_password, contact_number, doctorCode, leave_approval_senior_doctor_id } = data;
    const hashedPassword = await bcrypt.hash(user_password, 10);

    return await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO user_register (email, user_password, first_name, last_name, mobile_number,is_doctor, userCode) VALUES (?, ?,?, ?, ?, ?, ?)`,
        [email, hashedPassword, first_name, last_name, contact_number, true, doctorCode],
        (error, result) => {
          if (error) {
            return reject(error);
          }

          const userId = result.insertId;

          db.query(
            `INSERT INTO doctors (name, specialization, contact_number, email, user_id, doctorInTime, doctorOutTime, doctorCode, leave_approval) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.name, doctorData.specialization, contact_number, email, userId, doctorData.doctorInTime, doctorData.doctorOutTime, doctorCode, leave_approval_senior_doctor_id],
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          );
        }
      );
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
const cancelStatus = async (appointment_id, reason) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE appointments SET status = 'Cancelled', reason = ? WHERE appointment_id = ?`,
        [reason, appointment_id],
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
    const result = await new Promise((resolve, reject) => {
      db.query(
        `UPDATE appointments SET status ='Scheduled' WHERE appointment_id = ?`,
        appointment_id,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
};
const displayRequest = async () => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        `select a.appointment_id,p.patient_name,p.gender,p.age,a.appointment_date,a.appointment_time,a.status,do.name 
      from appointments a join personal_info p 
      on(a.patient_id=p.patient_id)
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
    const result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT p.patient_name, a.appointment_date, a.appointment_time, d.name, d.email AS doctor_email, a.reason
         FROM personal_info p 
         JOIN appointments a ON p.patient_id = a.patient_id
         JOIN doctors d ON a.doctor_id = d.doctor_id
         WHERE a.appointment_id = ?`,
        [appointment_id],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
};
const getAllAppointmentInformation = async (doctor_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
     
SELECT 
    a.appointment_id, 
    p.patient_name, 
    p.gender, 
    p.age, 
    a.appointment_date, 
    a.appointment_time, 
    a.status 
FROM appointments AS a 
JOIN personal_info AS p ON a.patient_id = p.patient_id 
WHERE p.is_deleted = FALSE 
AND a.doctor_id = ?
AND a.status IN ('Pending', 'Scheduled') 
ORDER BY a.appointment_id
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
      `SELECT DISTINCT 
    a.appointment_id, 
    p.patient_name, 
    p.gender, 
    p.age, 
    DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date, 
    a.appointment_time, 
    a.status, 
    do.name ,
    d.disease_type
FROM appointments a 
JOIN personal_info p ON a.patient_id = p.patient_id 
JOIN disease d ON a.appointment_id = d.appointment_id
JOIN doctors do ON a.doctor_id = do.doctor_id 
WHERE p.is_deleted = FALSE 
AND a.status IN ('Pending', 'Scheduled') 
ORDER BY a.appointment_id;
`,
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
  try{
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
}
catch(error){
  throw error;
}
};



const getAllEmailForAddAdmin = async () => {
  return new Promise((resolve, reject) => {
    db.query(
      `select id,
        email,first_name,last_name from user_Register 
        where is_admin=false and is_deleted=false order by email asc`,
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
        where is_doctor=false order by email asc`,
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
            return reject(error);
          }
          resolve(result[0]);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};



const createAdmin = async (data, adminCode) => {
  try {
    const { first_name, last_name, email, user_password, mobile_number } = data;
    const hashedPassword = await bcrypt.hash(user_password, 10);

    return await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO user_register (email, user_password, first_name, last_name, mobile_number,is_admin, userCode) VALUES (?, ?,?, ?, ?, ?, ?)`,
        [email, hashedPassword, first_name, last_name, mobile_number, true, adminCode],
        (error, result) => {
          if (error) {
            return reject(error);
          }


          resolve(result)
        }
      );
    });
  } catch (error) {
    throw error;
  }
};


const patientHaveAppointment = async (patient_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT patient_id, status FROM appointments 
       WHERE patient_id = ? AND status IN ('Pending', 'Scheduled')`,
      [patient_id],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};
const checkPrescription = async (appointment_id) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT appointment_id FROM prescriptions WHERE appointment_id= ?",
        appointment_id,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    return result.length > 0;
  } catch (error) {
    throw error;
  }
}

const updateLeaveApproval = async (leave_approval_senior_doctor_id, doctor_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE doctors SET leave_approval= ? WHERE doctor_id = ?`,
        [leave_approval_senior_doctor_id, doctor_id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });
  }
  catch (error) {
    throw error;
  }
}

const doctorCount = async () => {
  try {
     return new Promise((resolve, reject) => {
    db.query(
      ` select count(doctor_id)as totalDoctors from doctors where is_deleted=false`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
  }
  catch (error) {
    throw error;
  }
}
export {
  doctorCount,
  updateLeaveApproval,
  checkPrescription,
  checkIfUserExists,
  patientHaveAppointment,
  createAdmin,
  cancelStatus,
  getUserRegisterDetails,
  checkSuperAdmin,
  getUserByEmail,
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
  removeAdminAuthority,
  ageGroupWiseData,
  deletePatientDetails,
  getTotalCount,
  checkAdminCount,
};
