import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signUpDoctor = joi.object({
    firstName: joi.string().min(2).max(50).required(),
    lastName: joi.string().min(2).max(50).required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
    clinicAddress: joi.string().min(2).max(50).required(),
    phone: joi.number().positive().required(),
    file: joi.object({
        unionCard: joi.array().items(generalFields.file.required()).length(1).required(),
        certificate: joi.array().items(generalFields.file.required()).length(1).required(),
    }).required(),
    specialization: joi.string().min(2).max(50).required()



}).required()



export const loginDoctor = joi.object({

    email: generalFields.email,
    password: generalFields.password,
}).required()



export const confirmEmail = joi.object({

    
    email: generalFields.email,
 
    emailCode:joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),
 
 }).required()

export const CodeForgetPasswordDoctor = joi.object({

    
   email: generalFields.email,

    EmailPasswordCode:joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),

}).required()


 export const sendCodeEmailAgain=joi.object({
    
    email: generalFields.email,
}).required()



export const sendCodeForgetPasswordDoctor = joi.object({
    email: generalFields.email,
   
}).required()

export const token = joi.object({

    token: joi.string().required(),
}).required()


export const updateForgetPassword = joi.object({
    email: generalFields.email,
    newPassword: generalFields.password,
    cNewPassword: generalFields.password.valid(joi.ref("newPassword")),
 
}).required()