import { Router } from 'express';
import { signup, login, completeRegistration, createUser, forgotPassword, getUserOnboarded, setUserComplete } from '../controller/authController';
import { getUserProfile, updateAddressInformation, updatePassword, updatePersonalInformation } from '../controller/userController';

const router: Router = Router();               

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword); 
router.post('/update/user/password',updatePassword )
router.post('/complete/user/:userId/registration', completeRegistration);
router.post('/users', createUser);
router.post('/is-app/user/first-launch', getUserOnboarded)
router.post('/user/:userId/complete/profile', setUserComplete)

//get user information
router.get('/user/profile', getUserProfile)

//user controller
router.post('/update/user/personal/info', updatePersonalInformation);
router.post('/update/user/address/info', updateAddressInformation)
export default router;
