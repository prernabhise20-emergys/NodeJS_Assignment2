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
            MAX(pr.appointment_id) AS prescription_id,
            a.observation  -- Add the observation column
          FROM
            user_register u
          JOIN
            doctors d ON u.id = d.user_id
          JOIN
            appointments a ON d.doctor_id = a.doctor_id
          JOIN
            personal_info p ON a.patient_id = p.patient_id
          LEFT JOIN
            disease ds ON a.appointment_id = ds.appointment_id
          LEFT JOIN
            prescriptions pr ON pr.appointment_id = a.appointment_id  
          WHERE
            u.is_deleted = FALSE and p.is_deleted = FALSE and ds.is_deleted = FALSE
            AND a.status IN ('Scheduled', 'Pending','Completed')
            AND u.id = ?
          GROUP BY
            p.patient_name, p.age, u.id, u.email, d.name, ds.disease_type, d.specialization, a.appointment_id, a.appointment_date, a.appointment_time, a.status, a.observation
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
const changeAvailabilityStatus = async (is_available, userid) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE doctors 
               SET is_available = ? 
               WHERE user_id = ? AND is_deleted = false`, [is_available, userid], (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });

  } catch (error) {
    throw error;
  }
};

const markCancelled = async (doctor_id, start_date, end_date) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT appointment_id FROM appointments WHERE appointment_date BETWEEN ? AND ? and doctor_id=?;`,
        [start_date, end_date, doctor_id],
        (error, result) => {
          if (error) return reject(error);

          const ids = result.map(row => row.appointment_id);

          db.query(
            `UPDATE appointments SET status='Cancelled' WHERE appointment_date BETWEEN ? AND ? and doctor_id;`,
            [start_date, end_date, doctor_id],
            (updateError) => {
              if (updateError) return reject(updateError);

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

const addObservationData = async (observation, appointment_id) => {

  try {
    return new Promise((resolve, reject) => {
      db.query(`update appointments set observation=? where appointment_id=?`,
        [observation, appointment_id],
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
const editObservationData = async (observation, appointment_id) => {

  try {

    return new Promise((resolve, reject) => {
      db.query(`update appointments set observation=? where appointment_id=?`,
        [observation, appointment_id],
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
const deleteObservationData = async (appointment_id) => {
  try {

    return new Promise((resolve, reject) => {
      db.query(`update appointments set observation=null where appointment_id=?`,
        appointment_id,
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

const getObservationData = async (appointment_id) => {
  try {

    return new Promise((resolve, reject) => {
      db.query(`select appointment_id,observation from appointments where appointment_id=?`,
        appointment_id,
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
const applyForLeave = async (data, userid) => {
  try {
    const { start_date, end_date, leave_reason } = data;

    const result = await new Promise((resolve, reject) => {
      db.query(`SELECT doctor_id,leave_approval,name FROM doctors WHERE user_id = ?`, [userid], (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });

    const leave_approval = result[0].leave_approval;
    const doctor_id = result[0].doctor_id;
    const insertResult = await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO leave_application_details (doctor_id, start_date, end_date, leave_reason, approved_by) VALUES (?, ?, ?, ?, ?)`,
        [doctor_id, start_date, end_date, leave_reason, leave_approval],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });

    return insertResult;
  } catch (error) {
    console.error('Error applying for leave:', error);
    throw error;
  }
};
const getApprovalInfo = async (user_id) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        `
        SELECT d2.email AS approver_email,d1.name
        FROM doctors d1
        JOIN doctors d2 ON d1.leave_approval = d2.doctor_id
        WHERE d1.user_id = ?;
        `,
        [user_id],
        (error, results) => {
          if (error) {
            return reject(error);
          }

          console.log(results);
          resolve(results);
        }
      );
    });

    return result;

  } catch (error) {
    throw error;
  }
};

const getLeaveRequest = async (userid) => {
  try {
    const result = await new Promise((resolve, reject) => {


      db.query(`SELECT doctor_id FROM doctors WHERE user_id = ?`, userid, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
    const doctor_id = result[0].doctor_id;
    console.log('doctorid', doctor_id);
    const selectResult = await new Promise((resolve, reject) => {
      db.query(
        `
  SELECT l.leave_id,d1.name,l.start_date,l.end_date,l.leave_status,l.leave_reason
        FROM doctors d1
        JOIN doctors d2 ON d1.leave_approval = d2.doctor_id
        join leave_application_details l on l.doctor_id=d1.doctor_id
        WHERE l.approved_by = ? and l.leave_status in ('Pending','Approved');
        `,
        doctor_id,
        (error, results) => {
          if (error) {
            return reject(error);
          }

          console.log('result', results);
          resolve(results);
        }
      );
    });

    return selectResult

  }
  catch (error) {
    throw error;
  }
}

const changeLeaveStatus = async (leave_id, doctor_id) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(`update leave_application_details set leave_status='Approved' where leave_id=? and doctor_id=?`,
        [leave_id, doctor_id],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        });
    });
  }
  catch (error) {
    throw error;
  }
}
const getApproveLeaveInfo = async (leave_id) => {
  try {
    const selectResult = await new Promise((resolve, reject) => {

      db.query(
        `
    SELECT 
	    l.leave_id, 
    d1.email, 
 l.doctor_id, 
    l.start_date, 
    l.end_date, 
    l.leave_reason,
    d2.name AS doctor_name, 
    d1.email, 
       d1.name AS approval_doctor_name 
FROM leave_application_details l 
join doctors d1 on l.approved_by=d1.doctor_id 
JOIN doctors d2 ON d1.doctor_id = d2.leave_approval 
WHERE l.leave_id = ?
        `,
        leave_id,
        (error, results) => {
          if (error) {
            return reject(error);
          }

          console.log('result', results);
          resolve(results);
        }
      );
    });

    return selectResult

  }
  catch (error) {
    throw error;
  }
}
export {
  getApproveLeaveInfo,
  changeLeaveStatus,
  getLeaveRequest,
  getApprovalInfo,
  applyForLeave,
  getObservationData,
  deleteObservationData,
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