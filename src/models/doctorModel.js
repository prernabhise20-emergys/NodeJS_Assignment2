import db from "../db/connection.js";

const updateDoctorData = async (data, doctor_id) => {
  try {
    const updateData = {
      ...data,
    };

    console.log('Update data:', updateData);

    return new Promise((resolve, reject) => {
      db.query("UPDATE doctors SET ? WHERE doctor_id = ?",
        [updateData, doctor_id], (error, result) => {
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

const showAppointments = async (doctor_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(`select a.appointment_id,p.patient_name,p.gender,p.age,d.disease_type,a.appointment_date,a.appointment_time 
      from appointments a join personal_info p 
      on(a.patient_id=p.patient_id)
      join disease d
      on(d.patient_id=p.patient_id)
      where p.is_deleted=false and a.status='Scheduled' and a.doctor_id=? `,
        doctor_id, (error, result) => {
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