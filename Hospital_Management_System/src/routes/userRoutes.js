// import express from 'express';
// import userController from '../controllers/userController.js';  
// import { schemaValidator } from '../middlewares/userValidation.js';
// import { user_schemas } from '../common/constants/schemaConstant.js';
// import authenticateUser from '../middlewares/authMiddleware.js';
// import  ROUTE_CONSTANTS  from '../common/constants/routeConstant.js'; 

// const router = express.Router();

// const { USER, REGISTER, LOGIN, GET_USER, UPDATE_USER, DELETE_USER } = ROUTE_CONSTANTS;

// router.post(`${USER}${REGISTER}`, schemaValidator(user_schemas.createUserSchema), userController.register);
// router.post(`${USER}${LOGIN}`, schemaValidator(user_schemas.userLoginSchema), userController.login);
// router.get(`${USER}${GET_USER}`, authenticateUser, userController.getUser);
// router.put(`${USER}${UPDATE_USER}`, authenticateUser, schemaValidator(user_schemas.updateUserSchema), userController.updateUser); 
// router.delete(`${USER}${DELETE_USER}`, authenticateUser, userController.deleteUser);

// export default router;


import express from 'express';
import userController from '../controllers/userController.js';  
import { schemaValidator } from '../middlewares/userValidation.js';
import { user_schemas } from '../common/constants/schemaConstant.js';
import authenticateUser  from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', schemaValidator(user_schemas.createUserSchema), userController.register);
router.post('/login',authenticateUser, schemaValidator(user_schemas.userLoginSchema), userController.login);
router.get('/getUser',authenticateUser, userController.getUser);
router.put('/updateUser',authenticateUser,schemaValidator(user_schemas.updateUserSchema), userController.updateUser); 
router.delete('/deleteUser', authenticateUser,userController.deleteUser);
router.put('/addAdmin', authenticateUser,userController.addAdmin)
export default router;