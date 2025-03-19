import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendVerificationEmail from '../common/utility/sendVerificationEmail.js';
import{createUserData,checkIfUserExists,loginUser, getUserData, updateUserData,deleteUserData,addAsAdmin,removeAdminAuthority} from '../models/userModel.js';
import { MESSAGE, STATUS_CODE } from '../common/constants/statusConstant.js';
dotenv.config();

const register = async (req, res) => {
  try {
    const { email, user_password, first_name, last_name, mobile_number } = req.body;

    const userExists = await checkIfUserExists(email);
    if (userExists) {
     throw{
        status:STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.ALREADY_REGISTER,
      };
    }

    await createUserData(email, user_password, first_name, last_name, mobile_number);

    await sendVerificationEmail(email);  

    res.status(STATUS_CODE.CREATED).json({
      status: STATUS_CODE.CREATED,
      message:MESSAGE.REGISTER_SUCCESS,
    });

  } catch (error) {
    console.error(error.message);
    return res.status(error.status ||STATUS_CODE.ERROR).send({
      status:error.status || STATUS_CODE.ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *************************************************************

const login = async (req, res) => {
  try {
      const { email, user_password } = req.body;

      const user = await loginUser(email);

      if (!user) {
          throw{
              status: STATUS_CODE.INVALID,
              message: MESSAGE.INVALID_USER_MESSAGE
          };
      }

      const match = await bcrypt.compare(user_password, user.user_password);

      if (!match) {
          throw{
              status: STATUS_CODE.INVALID,
              message:MESSAGE.INVALID_USER_MESSAGE
          };
      }

      const token = jwt.sign(
          { userid:user.id, email: user.email, user_password: user.user_password,admin:user.is_admin },
          process.env.SECRET_KEY,
          { expiresIn: '3h' }
      );

      res.json({ message:MESSAGE.LOGIN_SUCCESS_MESSAGE, token });

  } catch (error) {
      console.error(error.message)
      res.status(error.status ||STATUS_CODE.SERVER_ERROR).json({
          status:error.status || STATUS_CODE.SERVER_ERROR,
          message:  error.message || MESSAGE.SERVER_ERROR_MESSAGE,

      });
  }
};

// *******************************************************************

const addAdmin =async(req,res)=>{
  try{
  const { admin: is_admin} = req.user;
  const { email} = req.body;

await addAsAdmin(is_admin,email);
throw{
  status: STATUS_CODE.SUCCESS,
  message: MESSAGE.ADD_ADMIN
};
} catch (error) {
console.error(error.message)
return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
  status:error.status ||STATUS_CODE.SERVER_ERROR,
  message: error.message ||  MESSAGE.SERVER_ERROR_MESSAGE,

});
}
}

// **************************************************************

const removeAdmin=async(req,res)=>{
  try{
    const { admin: is_admin} = req.user;
    const { email} = req.body;
  
  await removeAdminAuthority(is_admin,email);
  throw{
    status: STATUS_CODE.SUCCESS,
    message: MESSAGE.ADD_ADMIN
  };
  } catch (error) {
  console.error(error.message)
  return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
    status:error.status ||STATUS_CODE.SERVER_ERROR,
    message: error.message ||  MESSAGE.SERVER_ERROR_MESSAGE,
  
  });
  }
}
// **************************************************************

const updateUser = async (req, res) => {
  try {

      const{body:{email,user_password,first_name,last_name,mobile_number}}=req;
      const { uid: id } = req.user

      const formData ={email,user_password,first_name,last_name,mobile_number}

      await updateUserData(formData,id);

      throw{
          status: STATUS_CODE.SUCCESS,
          message: MESSAGE.USER_UPDATE_SUCCESS_MSG
      };
  } catch (error) {
      console.error(error.message)
      return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
          status:error.status ||STATUS_CODE.SERVER_ERROR,
          message: error.message ||  MESSAGE.SERVER_ERROR_MESSAGE,

      });
  }
};


// // *************************************************************************

const getUser = async (req, res) => {
  try {
      const tasks = await getUserData();
      res.status(STATUS_CODE.SUCCESS).send({
          status: STATUS_CODE.SUCCESS,
          message: MESSAGE.SUCCESS_MESSAGE,
          data: tasks
      });
  } catch (error) {
      console.error(error.message)
      return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
          status:error.status || STATUS_CODE.SERVER_ERROR,
          message: error.message || MESSAGE.SERVER_ERROR_MESSAGE
      });
  }
};

// // *******************************************************************************

const deleteUser = async (req, res) => {
  try {
const { Id: id } = req.user

      await deleteUserData(id);
     
      throw{
          status: STATUS_CODE.SUCCESS,
          message: MESSAGE.DELETE_SUCCESS_MESSAGE,
      };

  } catch (error) {
      console.error(error.message)
      return res.status(error.status ||STATUS_CODE.SERVER_ERROR).send({
          status:error.status || STATUS_CODE.SERVER_ERROR,
          message:  error.message || MESSAGE.SERVER_ERROR_MESSAGE,

      });
  }
};







export default { register, login, getUser,updateUser, deleteUser,addAdmin,removeAdmin};
