import db from "../db/connection.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const getUserData = async (userid) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          u.email,     
          u.first_name, 
          u.last_name, 
          u.mobile_number,
          d.is_available,
        FROM user_register u
        LEFT JOIN doctors d ON u.id = d.user_id
        WHERE u.is_deleted = FALSE 
        AND u.id = ?;`,
        [userid], 
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

const getDoctorData = async (userid) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        ` SELECT u.email,     
    u.first_name, 
    u.last_name, 
   u.mobile_number,
   d.doctorInTime,d.doctorOutTime,d.is_available
    from user_register u join doctors d
    on(u.id=d.user_id)
    WHERE u.is_deleted = FALSE  
    AND u.id = ?`,
        userid,
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
const getDeleteUserInfo = async (email) => {

  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT email, first_name, last_name, mobile_number FROM user_register WHERE is_deleted=true and email=?",
        email,
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

const checkAlreadyExist = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id FROM user_register WHERE is_deleted=true and email = ?`,
      email,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.length > 0);
      }
    );
  });
};


// ****************************************************

const createUserData = async (
  email,
  user_password,
  first_name,
  last_name,
  mobile_number

) => {
  try {
    const hashedPassword = await bcrypt.hash(user_password, 10);

    const user = {
      email,
      user_password: hashedPassword,
      first_name,
      last_name,
      mobile_number
    };

    return await new Promise((resolve, reject) => {
      db.query("insert into user_register set ?", user, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

// ******************************************************

const checkUserDeleteOrNot = (email) => {
  return new Promise((resolve, reject) => {

    db.query("SELECT id FROM user_register WHERE is_deleted = true AND email = ?", [email], (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result.length > 0);
    });
  });
};

const loginWithUsercode = (userCode) => {
  return new Promise((resolve, reject) => {

    db.query("SELECT * FROM user_register WHERE userCode = ? and is_deleted=false", [userCode], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.length > 0 ? results[0] : null);
    });
  });
};

const loginUser = (email) => {
  return new Promise((resolve, reject) => {

    db.query("SELECT * FROM user_register WHERE email = ? and is_deleted=false", [email], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.length > 0 ? results[0] : null);
    });
  });
};



const updateUserData = async (formData, id) => {
  try {
    const { first_name, last_name, mobile_number } =
      formData;
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE user_register set first_name=?, last_name=?, mobile_number=? WHERE id = ?",
        [first_name, last_name, mobile_number, id],
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

const updatePassword = async (email, newPassword) => {
  try {

    const hashPassword = await bcrypt.hash(newPassword, 10);

    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE user_Register SET user_password = ? WHERE email = ?",
        [hashPassword, email],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
};


const updateUserPassword = async (newPassword, id) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE user_Register SET user_password = ? WHERE id = ?",
        [newPassword, id],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// ************************************************************
const deleteUserData = async (doctor,userId) => {
  try {
    if(doctor){
      const data = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE user_register SET is_deleted = TRUE WHERE id = ?",
        userId,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
       db.query(
        "UPDATE doctors SET is_deleted = TRUE WHERE user_id = ?",
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
    }
    else{
    const data = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE user_register SET is_deleted = TRUE WHERE id = ?",
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
  }
  } catch (error) {
    throw error;
  }
};

// // ********************************************************************

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

const displayAdmin = async () => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT email FROM user_register WHERE is_admin = true AND is_deleted = false",
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

const checkAdminCount = async () => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) AS adminCount FROM user_register WHERE is_admin = TRUE",
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

const checkEmailExists = async (email) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id FROM user_register WHERE is_deleted= false and email = ?", email,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results.length > 0);
        }
      );
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const getName = async (email) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT first_name FROM user_register WHERE is_deleted = false AND email = ?", [email],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          if (results.length > 0) {
            resolve(results[0].first_name);
          } else {
            reject(new Error('User not found'));
          }
        }
      );
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const getDoctorInfo = async () => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT doctor_id, name, specialization, doctorInTime, doctorOutTime, is_available   
FROM doctors 
WHERE is_deleted = false;
`,
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
const isDoctorAvailable = (doctor_id, date, patient_id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT COUNT(*) AS count
    FROM appointments
    WHERE doctor_id = ? AND DATE(appointment_date) = ? AND patient_id = ? and status in('Scheduled','Pending')`,
      [doctor_id, date, patient_id], (error, results) => {
        if (error) {
          return reject(error);
        }
        const count = results[0].count;
        resolve(count === 0);
      });
  });
};

const createDoctorAppointment = (patient_id, doctor_id, appointment_date, time, disease_type, disease_description) => {
  return new Promise((resolve, reject) => {
    try {
      const utcDate = new Date(appointment_date).toISOString().split('T')[0];
      db.query(
        `INSERT INTO appointments (appointment_date, appointment_time, patient_id, doctor_id) VALUES (?, ?, ?, ?)`,
        [utcDate, time, patient_id, doctor_id],
        (error, result) => {
          if (error) {
            return reject(error);
          }

          const appointment_id = result.insertId; 

          db.query(
            `INSERT INTO disease (disease_type, disease_description, patient_id, appointment_id) VALUES (?, ?, ?, ?)`,
            [disease_type, disease_description, patient_id, appointment_id],
            (error, diseaseResult) => {
              if (error) {
                return reject(error);
              }
              resolve({ appointment_id, diseaseResult });
            }
          );
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};


const doctorFlag = async (email) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query("UPDATE user_register set is_doctor = true WHERE email = ?", email, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const checkDoctor = async (email) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query("SELECT email FROM doctors WHERE email = ?", email, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });

    return data.length > 0;
  } catch (error) {
    throw error;
  }
};

const checkDoctorAvailability = async (doctor_id, date) => {
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        `SELECT
    d.doctorInTime,
    d.doctorOutTime,
    a.appointment_date,
    a.appointment_time,
    a.status,
    d.is_available,
    p.patient_id,
    p.patient_name,
    p.date_of_birth,
    p.gender,
    p.age,
    p.weight,
    p.height,
    p.bmi,
    p.country_of_origin,
    p.is_diabetic,
    p.cardiac_issue,
    p.blood_pressure
FROM doctors d
LEFT JOIN appointments a
    ON d.doctor_id = a.doctor_id
    AND a.appointment_date = ?
    AND a.status IN ('Scheduled', 'Pending')
LEFT JOIN personal_info p
    ON a.patient_id = p.patient_id
    AND p.is_deleted = false
WHERE
    d.is_deleted = false
    AND d.doctor_id = ?

UNION ALL

SELECT
    d.doctorInTime,
    d.doctorOutTime,
    NULL AS appointment_date,  
    NULL AS appointment_time,
    NULL AS status,
    d.is_available,
    NULL AS patient_id,
    NULL AS patient_name,
    NULL AS date_of_birth,
    NULL AS gender,
    NULL AS age,
    NULL AS weight,
    NULL AS height,
    NULL AS bmi,
    NULL AS country_of_origin,
    NULL AS is_diabetic,
    NULL AS cardiac_issue,
    NULL AS blood_pressure
FROM doctors d
WHERE d.doctor_id = ?
AND NOT EXISTS (
    SELECT 1
    FROM appointments a
    LEFT JOIN personal_info p
        ON a.patient_id = p.patient_id
        AND p.is_deleted = false
    WHERE a.doctor_id = d.doctor_id
    AND a.appointment_date = ?
);
`,
        [date, doctor_id, doctor_id, date],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    return results;
  } catch (error) {
    throw error;
  }
};

const getSearchedDoctor = async (keyword) => {
  try {
    const searchQuery = `%${keyword}%`;
    return await new Promise((resolve, reject) => {
      db.query(` SELECT doctor_id,name, specialization, doctorInTime, doctorOutTime,is_available
          FROM doctors 
          WHERE is_deleted = false 
          AND (name LIKE ? OR specialization LIKE ?)`, [searchQuery, searchQuery], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

const setIsDoctor = async (email) => {
  try {

    return new Promise((resolve, reject) => {
      db.query(
        "update user_register set is_doctor=true where email=?",
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

  } catch (error) {
    throw error;
  }
};
const addAsAdmin = async (email) => {
  try {
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

  } catch (error) {
    throw error;
  }
};

const getAppointmentHistory = async (patient_id) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        `SELECT DISTINCT a.appointment_id, p.patient_name, doc.name AS doctorName, a.status, a.appointment_date,
                a.appointment_time, d.disease_type, d.disease_description
        FROM personal_info p
        JOIN disease d ON p.patient_id = d.patient_id
        JOIN appointments a ON d.appointment_id = a.appointment_id
        JOIN doctors doc ON doc.doctor_id = a.doctor_id
        WHERE a.patient_id = ?`,
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
const updateDoctorAppointment = (doctor_id, date, time, disease_type, disease_description, appointment_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE appointments SET appointment_date=?, appointment_time=?, status='Pending', doctor_id=? WHERE appointment_id=?`,
      [date, time, doctor_id, appointment_id],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        
        updateDisease(disease_type, disease_description, appointment_id)
        resolve(result);
      }
    );
  });
};

const updateDisease = ( disease_type, disease_description,appointment_id) => {

  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE disease SET disease_type=?, disease_description=? WHERE appointment_id=?`,
      [disease_type, disease_description, appointment_id],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

const getAppointmentInfo = async (appointment_id) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          a.appointment_id, 
          a.status, 
          DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date, 
          a.appointment_time, 
          GROUP_CONCAT(d.disease_type) AS disease_types,
          GROUP_CONCAT(d.disease_description) AS disease_description,
          doc.doctor_id,
          doc.name
        FROM personal_info p
        JOIN appointments a ON p.patient_id = a.patient_id
        LEFT JOIN disease d ON d.appointment_id = a.appointment_id 
        JOIN doctors doc ON a.doctor_id = doc.doctor_id
        WHERE a.appointment_id = ?
        GROUP BY a.appointment_id, a.status, a.appointment_date, a.appointment_time`,
        [appointment_id],
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


export {
  getAppointmentInfo,
  updateDoctorAppointment,
  getAppointmentHistory,
  getDoctorData,
  loginWithUsercode,
  addAsAdmin,
  setIsDoctor,
  getSearchedDoctor,
  checkDoctorAvailability,
  checkDoctor,
  doctorFlag,
  createDoctorAppointment,
  isDoctorAvailable,
  getDoctorInfo,
  getName,
  checkAdminCount,
  displayAdmin,
  checkUserDeleteOrNot,
  getDeleteUserInfo,
  checkAlreadyExist,
  createUserData,
  checkIfUserExists,
  loginUser,
  getUserData,
  updateUserData,
  deleteUserData,
  updatePassword,
  checkEmailExists,
  updateUserPassword
};
