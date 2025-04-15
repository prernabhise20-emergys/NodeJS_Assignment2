import db from "../db/connection.js";

const updateDoctorData = async (data,user_id) => {
  try {
    const updateData = {
      ...data,
    };

    console.log('userid:', user_id);

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
      console.log("Fetching appointments for User ID:", user_id);

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
                  COALESCE(GROUP_CONCAT(ds.disease_type SEPARATOR ', '), 'Unknown') AS disease_types
              FROM user_register u
              JOIN doctors d ON u.id = d.user_id
              JOIN appointments a ON d.doctor_id = a.doctor_id
              JOIN personal_info p ON a.patient_id = p.patient_id
              LEFT JOIN disease ds ON ds.patient_id = p.patient_id  
              WHERE u.is_deleted = FALSE 
              AND a.status = 'Scheduled'
              AND u.id = ?
              GROUP BY p.patient_name,p.age, u.id, u.email, d.name, d.specialization, a.appointment_id, a.appointment_date, a.appointment_time, a.status
              ORDER BY a.appointment_id;
          `, [user_id], (error, result) => { 
              if (error) {
                  console.error("SQL Query Error:", error);
                  return reject(error);
              }
              return resolve(result);
          });
      });

  } catch (error) {
      console.error("Error in showAppointments:", error);
      throw error;
  }
};


const savePrescription = async (appointment_id, url) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO prescriptions (appointment_id, file_url) VALUES (?, ?)`, [appointment_id, url], (error, result) => {
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
        `SELECT p.patient_name AS patientName,p.age,p.gender,p.date_of_birth, a.appointment_date as date,d.name AS doctorName,d.specialization
        from appointments a join personal_info p
        ON p.patient_id = a.patient_id
        join doctors d
        on(d.doctor_id=a.doctor_id)
        WHERE p.is_deleted = false AND a.appointment_id = ?`,
        [appointment_id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result || result.length === 0) {
            return reject(new Error(`No data found for appointment_id: ${appointment_id}`));
          }
          return resolve(result[0]); 
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

export {
  getAppointmentData,
  savePrescription,
  updateDoctorData,
  showAppointments
}