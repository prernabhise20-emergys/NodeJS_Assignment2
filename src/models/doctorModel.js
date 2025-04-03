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

const changeStatus = async (status, appointment_id) => {
  try {
      console.log(status, appointment_id);
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
export  {
  changeStatus, 
  updateDoctorData,
  showAppointments
}