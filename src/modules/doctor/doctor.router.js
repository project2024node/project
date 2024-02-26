import { Router } from "express";

import * as doctorController from "./controller/doctor.js"



import {fileUpload,fileValidation} from '../../utils/multer.js'
import * as validators from './doctor.validation.js'
import {validation} from'../../middleware/validation.js'
import { authDoctor } from "../../middleware/auth.js";

const router = Router()


router.get("/",doctorController.doctors)




router.post('/signupDoctor',

fileUpload(fileValidation.image).fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'unionCard', maxCount: 1 }
]),
validation(validators.signUpDoctor),
doctorController.signupDoctor)

router.post('/loginDoctor',
validation(validators.loginDoctor),
doctorController.loginDoctor)


router.put('/confirmEmailDoctor',
validation(validators.confirmEmail),
doctorController.confirmEmailDoctor)


router.get('/NewConfirmEmail/:token',
validation(validators.token),
doctorController.generateRefreshToken)

router.patch("/sendCodeEmailConfirm",
validation(validators.sendCodeEmailAgain),
doctorController.sendCodeEmail)


router.put("/sendCodeForgetPasswordDoctor",
validation(validators.sendCodeForgetPasswordDoctor),
doctorController.sendCodeForgetPasswordDoctor)


router.put("/CodeForgetPassword",
validation(validators.CodeForgetPasswordDoctor),
doctorController.CodeForgetPasswordDoctor)



router.patch("/updateForgetPasswordDoctor",
validation(validators.updateForgetPassword),

doctorController.updatePassword)
export default router