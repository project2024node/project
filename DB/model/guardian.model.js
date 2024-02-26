import mongoose, {Model, Schema, model} from "mongoose";

const guardianSchema = new Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
      default: 'Male',
    },
    homeAddress: {
      type: String,
      required: true,
    },
    patientId: {
      type: Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
  },{
    timestamps: true
});
  
  const guardian = mongoose.models.guardian || model('Guardian', guardianSchema)
  export default guardian
