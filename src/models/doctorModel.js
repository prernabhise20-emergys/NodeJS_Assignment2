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

const updateDoctorData = async (data, user_id) => {
  try {
    const updateData = {
      ...data,
    };

    return new Promise((resolve, reject) => {
      db.query("UPDATE doctors SET ? WHERE user_id = ?",
        [updateData, user_id], (error, result) => {
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
          COALESCE(GROUP_CONCAT(ds.disease_type SEPARATOR ', '), 'Unknown') AS disease_types,
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
          u.is_deleted = FALSE and p.is_deleted=false
          AND a.status = 'Scheduled'
          AND u.id = ?
        GROUP BY
          p.patient_name, p.age, u.id, u.email, d.name, d.specialization, a.appointment_id, a.appointment_date, a.appointment_time, a.status
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
SELECT p.patient_name AS patientName,p.age,p.gender,p.date_of_birth, a.appointment_date as date,d.name AS doctorName,d.specialization
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
export {
  getPrescriptionByAppointmentId,
  updatePrescription,
  getDoctor,
  getAppointmentData,
  savePrescription,
  updateDoctorData,
  showAppointments
}