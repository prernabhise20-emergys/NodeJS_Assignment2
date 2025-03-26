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

// ************************************************************

const addAsAdmin = async (isAdmin,email) => {
  try {
    if (isAdmin) {
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

    }
  } catch (error) {
    throw error;
  }
};

// **********************************************************

const removeAdminAuthority=async(isAdmin,email)=>{
  try {
    if (isAdmin) {
      return new Promise((resolve, reject) => {
        db.query(
          "update user_register set is_admin=false where email=?",
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

    }
  } catch (error) {
    throw error;
  }
}
// **********************************************************

const updateUserData = async (formData, id) => {
  try {
    const { email, user_password, first_name, last_name, mobile_number } =
      formData;
    const hashPassword = await bcrypt.hash(user_password, 10);
    const user = {
      email,
      user_password: hashPassword,
      first_name,
      last_name,
      mobile_number,
    };
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE user_register SET ? WHERE id = ?",
        [user, id],
        (error, result) => {
          if (error) {
            console.error("Database query error", error);
            return reject(new Error("Database operation failed"));
          }
          resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// ******************************************************************

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

export {
  createUserData,
  checkIfUserExists,
  loginUser,
  getUserData,
  updateUserData,
  deleteUserData,
  addAsAdmin,
  removeAdminAuthority,
  checkAdminCount
};
