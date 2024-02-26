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

export const forgetPassword = joi.object({
    forgetCode: joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref("password")),

}).required()

export const token = joi.object({

    token: joi.string().required(),
}).required()


export const updateForgetPassword = joi.object({
    
    newPassword: generalFields.password.invalid(joi.ref("oldPassword")),
    cPassword: generalFields.cPassword.valid(joi.ref("newPassword")),
 
}).required()