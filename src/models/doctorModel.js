import db from "../db/connection.js";



const getDoctor = async (userid) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        `  SELECT name as doctorName,     
           specialization, 
           contact_number, 
           doctorInTime,
           doctorOutTime
           from doctors
           WHERE is_deleted = FALSE 
           AND user_id = ?`,
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

const updateDoctorData = async (data, first_name, last_name, email) => {
  try {
    const doctorData = { ...data };

    return await new Promise((resolve, reject) => {
      db.query(
        "UPDATE doctors SET ? WHERE email = ?",
        [doctorData, email],
        (error, result) => {
          if (error) {
            return reject(error);
          }

          db.query(
            "UPDATE user_register SET first_name = ?, last_name = ? WHERE email = ?",
            [first_name, last_name, email],
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


const showAppointments = async (user_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(`
           SELECT
          p.patient_name,
          u.id AS user_id,
          p.age,
          u.email,
          d.name AS doctor_name,
          d.specialization,
          a.appointment_id,
          a.appointment_date,
          a.appointment_time,
          a.status,
ds.disease_type,
          MAX(pr.appointment_id) AS prescription_id
        FROM
          user_register u
        JOIN
          doctors d ON u.id = d.user_id
        JOIN
          appointments a ON d.doctor_id = a.doctor_id
        JOIN
          personal_info p ON a.patient_id = p.patient_id
        LEFT JOIN
          disease ds ON ds.patient_id = p.patient_id
        LEFT JOIN
          prescriptions pr ON pr.appointment_id = a.appointment_id  
        WHERE
          u.is_deleted = FALSE and p.is_deleted=false and ds.is_deleted=false
          AND a.status in('Scheduled','Pending')
          AND u.id = ?
        GROUP BY
          p.patient_name, p.age, u.id, u.email, d.name,ds.disease_type, d.specialization, a.appointment_id, a.appointment_date, a.appointment_time, a.status
        ORDER BY
          a.appointment_id;
      `, [user_id], (error, result) => {
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



const savePrescription = async (appointment_id, url, dateIssued) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO prescriptions (appointment_id, file_url,dateIssued) VALUES (?, ?,?)`,
        [appointment_id, url, dateIssued],
        (error, result) => {
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

const getAppointmentData = async (appointment_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `
SELECT p.patient_id,p.patient_name AS patientName,p.age,p.gender,p.date_of_birth, a.appointment_date as date,d.name AS doctorName,d.specialization
        from appointments a join personal_info p
        ON p.patient_id = a.patient_id
        join doctors d
        on(d.doctor_id=a.doctor_id)
        WHERE p.is_deleted = false AND a.appointment_id = ? AND a.status='Scheduled' `,
        [appointment_id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result[0]);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

const getPrescriptionByAppointmentId = async (appointment_id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM prescriptions WHERE appointment_id = ?`,
      [appointment_id],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.length > 0 ? result[0] : null);
      });
  });
};

const updatePrescription = async (appointment_id, url, dateIssued) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE prescriptions SET file_url = ?, dateIssued = ? WHERE appointment_id = ?`,
        [url, dateIssued, appointment_id],
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
const changeAvailabilityStatus = async (is_available, userid, unavailable_from_date, unavailable_to_date) => {
  try {
    let query, params;

    if (is_available) {
      query = `UPDATE doctors SET is_available = ?, unavailable_from_date = NULL, unavailable_to_date = NULL WHERE user_id = ? and is_deleted=false`;
      params = [is_available, userid];
    } else {

      query = `UPDATE doctors SET is_available = ?, unavailable_from_date = ?, unavailable_to_date = ? WHERE user_id = ? and is_deleted=false`;
      params = [is_available, unavailable_from_date, unavailable_to_date, userid];
    }

    const row = await new Promise((resolve, reject) => {
      db.query(query, params, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    return row;
  } catch (error) {
    throw error;
  }
};


const markCancelled = async (unavailable_from_date, unavailable_to_date) => {
  try {
      return new Promise((resolve, reject) => {
          db.query(
              `SELECT appointment_id FROM appointments WHERE appointment_date BETWEEN ? AND ?;`,
              [unavailable_from_date, unavailable_to_date],
              (error, result) => {
                  if (error) {
                      return reject(error);
                  }
                  
                  const ids = result.map(row => row.appointment_id); 
                

                  db.query(
                      `UPDATE appointments SET status='Cancelled' WHERE appointment_date BETWEEN ? AND ?;`,
                      [unavailable_from_date, unavailable_to_date],
                      (updateError) => {
                          if (updateError) {
                              return reject(updateError);
                          }
                          resolve(getUserInformation(ids)); 
                      }
                  );
              }
          );
      });
  } catch (error) {
      throw error;
  }
};

const getUserInformation = async (appointment_ids) => {
  try {
      return new Promise((resolve, reject) => {
          db.query(
              `SELECT a.appointment_id, p.patient_name, u.email, a.appointment_date, a.appointment_time, d.name, d.email AS doctor_email
               FROM user_register u 
               JOIN personal_info p ON u.id = p.user_id
               JOIN appointments a ON p.patient_id = a.patient_id
               JOIN doctors d ON a.doctor_id = d.doctor_id
               WHERE a.appointment_id IN (?) and p.is_deleted=false`, 
              [appointment_ids],
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

const addObservationData=async(observation,appointment_id)=>{

  try {
    return new Promise((resolve, reject) => {
      db.query(`update appointments set observation=? where appointment_id=?`,
        [observation,appointment_id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        });
    });
  } catch (error) {
    throw error;
  }
}
const editObservationData=async(observation,appointment_id)=>{

  try {
    return new Promise((resolve, reject) => {
      db.query(`update appointments set observation=? where appointment_id=?`,
        [observation,appointment_id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        });
    });
  } catch (error) {
    throw error;
  }
}
export {
  editObservationData,
  addObservationData,
  markCancelled,
  changeAvailabilityStatus,
  getPrescriptionByAppointmentId,
  updatePrescription,
  getDoctor,
  getAppointmentData,
  savePrescription,
  updateDoctorData,
  showAppointments
}