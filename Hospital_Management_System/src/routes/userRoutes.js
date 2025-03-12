import express from 'express';
import userController from '../controllers/userController.js';  
import { schemaValidator } from '../middlewares/userValidation.js';
import { user_schemas } from '../common/constants/schemaConstant.js';
import authenticateUser  from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', schemaValidator(user_schemas.createUserSchema), userController.register);
router.post('/login', schemaValidator(user_schemas.userLoginSchema), userController.login);
router.get('/getUser',authenticateUser, userController.getUser);
router.put('/updateUser',authenticateUser,schemaValidator(user_schemas.updateUserSchema), userController.updateUser); 
router.delete('/deleteUser', authenticateUser,userController.deleteUser);

export default router;
