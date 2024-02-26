import mongoose, { Schema, Types, model } from "mongoose";

const patientSchema = new Schema({
  firstName: { type: String, required: true, },
  lastName: { type: String, required: true, },
  email: { type: String, required: true, unique: true, },
  confirmEmail: { type: Boolean, default: false },
  emailCode: { type: Number, default: null },
  verifyEmail:{type:Boolean,default:false},
  EmailPasswordCode:{type:Number,default:null},
  
  //forgetCode: { type: Number, default: null },
 // heartbeat:{type:Number},
  //motionRate:{type:Number},
  changePasswordTime: { type: Date },
  password: { type: String, required: true, },
  gender: { type: String, enum: ['Male', 'Female'], required: true, default: 'Male' },
  homeAddress: { type: String, required: true },
  phoneNumber: { type: [String], required: true },
  birthDate: { type: Date, required: true },
  doctorId: { type: Types.ObjectId, ref: 'Doctor' },
  
}, {
  timestamps: true
});

const Patient = mongoose.models.patient || model('Patient', patientSchema)

export default Patient