import {Router} from "express";


const router=Router();
import * as controller from '../controllers/appController.js';
import Auth,{localVariables} from '../middleware/auth.js';

/**post routes */
router.route('/register').post(controller.register);
router.route('/registerMail').post(controller.registerMail);
router.route('/authenticate').post(controller.verifyUser,(req,res)=>res.end());
router.route('/sendotp').post(controller.verifyUser,controller.sendOtp);
router.route('/login').post(controller.verifyUser,controller.login);

/**get routes */
router.route('/user/:username').get(controller.getUser);
router.route('/generateOTP').get(controller.verifyUser,localVariables,controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP);
router.route('/createResetSession').get(controller.createResetSession);

/**put routes */
router.route('/updateuser').put(Auth,controller.UpdateUser);
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword);







export default router;