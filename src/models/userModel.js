import db from "../db/connection.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const getUserData = async (userid) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT email,first_name,last_name,mobile_number FROM user_register WHERE is_deleted =FALSE and id=?",
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
      `SELECT * FROM user_register WHERE is_deleted=true and email = ?`,
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
const checkUserDeleteOrNot = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM user_register WHERE is_deleted=true and email = ?`,
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
      mobile_number,
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

const loginUser = (email) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM user_register WHERE email = ?",
        email,
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.length > 0 ? results[0] : null);
          }
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// **********************************************************

const updateUserData = async (formData, id) => {
  try {
    const { first_name, last_name, mobile_number } =
      formData;
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE user_register set first_name=?, last_name=?, mobile_number=? WHERE id = ?",
        [ first_name, last_name,mobile_number, id],
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
    console.log('model', newPassword);

    const hashPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashPassword);

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

// ************************************************************
const deleteUserData = async (userId) => {
  
  try {
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
  } catch (error) {
    throw error;
  }
};

// // ********************************************************************

const checkIfUserExists = async (email) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM user_register WHERE is_deleted=false and email= ?",
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
    const excludedEmail = 'prerna.bhise@gmail.com';
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT email FROM user_register WHERE is_admin = true AND is_deleted = false",
        (error, result) => {
          if (error) return reject(error);
          const filteredAdmins = result.filter(admin => admin.email !== excludedEmail);
          return resolve(filteredAdmins);
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
        "SELECT id FROM user_register WHERE is_deleted= false and email = ?",email,
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
        "SELECT first_name FROM user_register WHERE is_deleted= false and email = ?",email,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
    
    return data;
  } catch (error) {
    throw error;
  }
};

const DoctorLogin = async (email) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM user_register WHERE is_deleted=false and email= ?",
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
export {
  DoctorLogin,
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
};
