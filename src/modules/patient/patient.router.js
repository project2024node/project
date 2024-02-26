import { Router } from "express";

import * as patientController from "./controller/patient.js"
import * as validators from './patient.validation.js'
import {validation} from'../../middleware/validation.js'

const router = Router()


router.get("/",patientController.patients)

router.post('/signupPatient',

validation(validators.signUpPatient),
patientController.signupPatient)

router.post('/loginPatient',
validation(validators.loginPatient),
patientController.loginPatient)


router.put('/confirmEmailPatient',
validation(validators.sendCodeEmail),
patientController.confirmEmailPatient)


router.get('/NewConfirmEmail/:token',
validation(validators.token),
patientController.generateRefreshToken)

router.patch("/sendCodeEmail",
validation(validators.sendCodeEmailAgain),
patientController.sendCodeEmail)



router.put("/sendCodeForgetPasswordPatient",
validation(validators.sendCodeForgetPasswordPatient),
patientController.sendCodeForgetPasswordPatient)


router.put("/CodeForgetPassword",
validation(validators.CodeForgetPasswordPatient),
patientController.CodeForgetPasswordPatient)



router.patch("/updateForgetPasswordPatient",
validation(validators.updateForgetPassword),

patientController.updatePassword)

export default router