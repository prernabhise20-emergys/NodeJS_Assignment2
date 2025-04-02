const createPersonalDetails = async (data, userId, email) => {
    try {
      const today = new Date();
      let {
        patient_name,
        date_of_birth,
        gender,
        height,
        weight,
        is_diabetic,
        cardiac_issue,
        blood_pressure,
        country_of_origin,
      } = data;
  
      height = height * 0.3048;
      const userAge = today.getFullYear() - new Date(date_of_birth).getFullYear();
      let userBMI = weight / (height * height);
  
      data = {
        patient_name: patient_name,
        date_of_birth: date_of_birth,
        age: userAge,
        gender: gender,
        height: height,
        weight: weight,
        bmi: userBMI,
        is_diabetic: is_diabetic,
        cardiac_issue: cardiac_issue,
        blood_pressure: blood_pressure,
        country_of_origin: country_of_origin,
        created_by: email,
        updated_by: email,
        // patient_name: patient_name,
        // gender: gender,
        // user_id: userId,
        // created_by: email,
        // updated_by: email,
        // age: userAge,
        // bmi: userBMI,
        // date_of_birth: date_of_birth,
        // weight: weight,
        // height: height,
        // country_of_origin: country_of_origin,
        // is_diabetic: is_diabetic,
        // cardiac_issue: cardiac_issue,
        // blood_pressure: blood_pressure,
        ...data
      };
  
      return new Promise((resolve, reject) => {
        db.query("INSERT INTO personal_info SET ?", data, (error, result) => {
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
  
  const updatePersonalDetails = async (data, patient_id) => {
    try {
      const values = [
        data.patient_name,
        data.date_of_birth,
        data.gender,
        data.height,
        data.weight,
        data.is_diabetic,
        data.cardiac_issue,
        data.blood_pressure,
        data.country_of_origin,
        patient_id,
      ];
  
      return new Promise((resolve, reject) => {
        db.query(
          `UPDATE personal_info SET patient_name=?, date_of_birth = ?,gender=?, height = ?, 
          weight = ?, is_diabetic = ?, cardiac_issue = ?, blood_pressure = ?, country_of_origin = ? 
          WHERE patient_id = ?`,
          values,
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
  
  
const deletePersonalDetails = async (patient_id) => {
    try {
      const data = await new Promise((resolve, reject) => {
        db.query(
          "UPDATE personal_info SET IS_DELETED = TRUE WHERE patient_id = ?",
          patient_id,
          (error, result) => {
            if (error) {
              return reject(error);
            }
            if (result.affectedRows === 0) {
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