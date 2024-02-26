import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signUpPatient = joi.object({
    firstName: joi.string().min(2).max(50).required(),
    lastName: joi.string().min(2).max(50).required(),
    email: generalFields.email.required(),


    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
    homeAddress: joi.string().min(2).max(50).required(),
    phoneNumber: joi.array().min(2).max(2).required(),
    
    birthDate: joi.date().required(),
    gender:joi.string().min(2).max(50).required()


}).required()



export const loginPatient = joi.object({

    email: generalFields.email,
    password: generalFields.password,
}).required()


export const sendCodeEmailAgain = joi.object({

    email: generalFields.email,

}).required()

export const sendCodeEmail = joi.object({

    
    email: generalFields.email,

    emailCode:joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),

}).required()



export const token = joi.object({

    token: joi.string().required(),
}).required()


export const CodeForgetPasswordPatient = joi.object({

    
    email: generalFields.email,
 
     EmailPasswordCode:joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),
 
 }).required()
 
export const sendCodeForgetPasswordPatient= joi.object({
    email: generalFields.email,
   
}).required()



export const updateForgetPassword = joi.object({
    email: generalFields.email,
    newPassword: generalFields.password,
    cNewPassword: generalFields.password.valid(joi.ref("newPassword")),
 
}).required()