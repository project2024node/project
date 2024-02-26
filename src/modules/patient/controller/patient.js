
import { hash, compare } from '../../../utils/HashAndCompare.js'

import { generateToken, verifyToken } from '../../../utils/GenerateAndVerifyToken.js'
import sendEmail from '../../../utils/email.js'
import { asyncHandler } from '../../../utils/errorHandling.js'
import patientModel from '../../../../DB/model/patient.model.js'

export const patients = async (req, res, next) => {
    const patient = await patientModel.find()

    return res.status(200).json({ message: "Done", patient })
}


export const signupPatient = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, gender, homeAddress, phoneNumber, birthDate } = req.body
    const checkPatient = await patientModel.findOne({ email: email.toLowerCase() })
    if (checkPatient) {
        //  return res.status(404).json({ message: "email exist", })

        return next(new Error(`Email exist`, { cause: 409 }))
    }
    
    const emailCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
 const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{
        background-color: #88BDBF;margin: 0px;
    }
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
    care bracelet  
    </h1>
    </td>
    <td>
    
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">verify email</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${emailCode}</p>
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">confirm email</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`

    if (!await sendEmail({ to: email, subject: 'confirmation-email', html })) {

        return next(new Error(`fail to send this email`, { cause: 400 }))
        //   return res.status(400).json({ message: "fail to send email"})


    }
    ///hash password
    const hashPassword = hash({ plaintext: password })
    //save//create patient 



    const { _id } = await patientModel.create({
        firstName, lastName, email,
        emailCode,
        password: hashPassword
        , gender, homeAddress,
        phoneNumber, birthDate
    })
    return res.status(201).json({ message: "Done", _id })
})


export const confirmEmailPatient = asyncHandler(async (req, res, next) => {
    const { email, emailCode } = req.body

    const patient = await patientModel.findOne({ email })
    if (!patient) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    // if (doctor.emailCode != emailCode) {

    if (patient.emailCode !== parseInt(emailCode)) {
        return next(new Error('In-valid reset code', { cause: 400 }))
    }
    patient.emailCode = null;

    patient.confirmEmail = true
    await patient.save()

    return res.status(200).json({ message: "Done" })
})


export const loginPatient = async (req, res, next) => {


    const { email, password } = req.body
    //check email exist
    const patient = await patientModel.findOne({ email: email.toLowerCase() })
    if (!patient) {
        return next(new Error(`email not exist`, { cause: 404 }))
        //    return res.status(404).json({ message: "email exist"})

    }
    if (!patient.confirmEmail) {
        // return res.status(400).json({ message: "please confirm email" })

        return next(new Error(`please confirm your Email first.`, { cause: 400 }))

    }
    const match = compare({ plaintext: password, hashValue: patient.password })
    if (!match) {
        // return res.status(400).json({ message: "in valid login"})

        return next(new Error(`IN-valid login data`, { cause: 400 }))

    }
    const access_Token = generateToken({
        payload: { id: patient._id },
        expiresIn: 60 * 30
    })

    const refresh_token = generateToken({
        payload: { id: patient._id },
        expiresIn: 60 * 60 * 24 * 365
    })

    await patient.save()
    return res.status(200).json({
        message: "Done",
        access_Token,

        refresh_token
    })
}


export const sendCodeEmail = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const emailCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const patient = await patientModel.findOneAndUpdate({ email }, { emailCode })
    if (!patient) {
        return next(new Error('In-valid account', { cause: 400 }))

    }
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{
        background-color: #88BDBF;margin: 0px;
    }
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
    care bracelet  
    </h1>
    </td>
    <td>
    
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">verify email</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${emailCode}</p>
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">confirm email</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`


    if (!await sendEmail({ to: email, subject: 'verify email', html })) {

        return next(new Error("fail to send this email", { cause: 400 }))

    }
    return res.status(200).json({ message: "Done" })
})





export const generateRefreshToken = asyncHandler(async (req, res, next) => {


    const { token } = req.params
    const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN })
    if (!email) {
        return next(new Error('In-valid token payload', { cause: 400 }))
        // return res.status(200).redirect(`${process.env.FE_URL}/#/In-validEmail`)
        // return res.status(400).json({ message: "invalid token payload", })

    }
    const patient = await patientModel.findOne({ email: email.toLowerCase() })
    if (!patient) {
        return next(new Error("Not register account", { cause: 400 }))
        //  return res.status(404).json({ message: "Not register account", })

    }
    if (!patient.confirmEmail) {
        return res.status(404).json({ message: "Not confirm email", })
    }
    const newToken = generateToken({ payload: { email }, signature: process.env.EMAIL_TOKEN, expiresIn: 60 * 2 })


    const link = `${req.protocol}://${req.headers.host}/patient/confirmEmail/${newToken}`
    const rfLink = `${req.protocol}://${req.headers.host}/patient/NewConfirmEmail/${token}`

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0"  style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    <br>
    <br>
    <br>
    <br>
    <a href="${rfLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new email</a>
    
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">


    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
    if (!await sendEmail({ to: email, subject: 'confirmation-email', html })) {

        return next(new Error("fail to send this Email", { cause: 400 }))
        //  return res.status(400).json({ message: "fail to send", })

    }
    // return res.status(200).redirect(`${process.env.FE_URL}/#/ConfirmEmail`)
    return res.status(200).send('<h1>New Confirmation Email have been to your inbox please check it asap</h1>')
})

export const updatePassword = asyncHandler(async (req, res, next) => {
    const {  newPassword } = req.body
    
    const patient = await patientModel.findById(req.patient._id)

    const hashPassword = hash({ plaintext: newPassword })
    patient.password = hashPassword;
    await patient.save();
    return res.status(200).json({ message: "Done" })
})