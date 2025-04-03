import db from "../db/connection.js";

const updateDoctorData = async (data,doctor_id) => {
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
  
  const showAppointments=async(doctor_id)=>{
try{
  return new Promise((resolve, reject) => {
    db.query("select appointment_id,appointment_date,appointment_time from appointments a join personal_info p on(a.patient_id)",
       [updateData, doctor_id], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });

}catch(error){
  throw error;
}
  }
  export {
    updateDoctorData,
    showAppointments
  }