
import doctorModel from "../../DB/model/doctor.model.js";

import patientModel from "../../DB/model/patient.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
export const authDoctor = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return res.json({ message: "In-valid bearer key" });
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];
    
    if (!token) {
      return res.json({ message: "In-valid token" })
  }
    const decoded = verifyToken( {token} );
    
    if (!decoded?.id) {
      return res.json({ message: "In-valid token payload" });
    }
    const authDoctor = await doctorModel
      .findById(decoded.id)
      
    if (!authDoctor) {
      return res.json({ message: "Not register account" });
    }
    req.doctor = authDoctor;
    return next();
  } catch (error) {
  
    return res.json({ message: "catch error", error, stack: error.stack });
  }
};

export const authPatient = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return res.json({ message: "In-valid bearer key" });
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];
    
    if (!token) {
      return res.json({ message: "In-valid token" })
  }
    const decoded = verifyToken( {token} );
    
    if (!decoded?.id) {
      return res.json({ message: "In-valid token payload" });
    }
    const authPatient = await patientModel
      .findById(decoded.id)
      
    if (!authPatient) {
      return res.json({ message: "Not register account" });
    }
    req.patient = authPatient;
    return next();
  } catch (error) {
  
    return res.json({ message: "catch error", error, stack: error.stack });
  }
};
