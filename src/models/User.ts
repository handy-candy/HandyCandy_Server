import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema = new mongoose.Schema({
  
  id: {
    type: Number,
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
  salt: {
    type: String,
  },
  nickname: {
    type: String,
    required: true,
  },
  gender: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  personal_info_agreement: {
    type: Boolean,
  },
  alarm_agreement: {
    type: Boolean,
  },
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },

});

export default mongoose.model<IUser & mongoose.Document>("User", UserSchema);
