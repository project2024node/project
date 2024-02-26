

import mongoose, { Schema, model } from "mongoose";

const doctorSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  confirmEmail: { type: Boolean, default: false },
  emailCode: { type: Number, default: null },
  //forgetCode: { type: Number, default: null },
  verifyEmail:{type:Boolean,default:false},
  EmailPasswordCode:{type:Number,default:null},
  changePasswordTime: { type: Date },
  password: { type: String, required: true, },
  clinicAddress: { type: String, required: true },
  phone: { type: String, required: true },
  unionCard: { type: Object, required: true },
  certificate: { type: Object, required: true },
  specialization: { type: String, required: true },
}, {
  timestamps: true
});

const doctorModel = mongoose.models.Doctor || model('Doctor', doctorSchema)

export default doctorModel