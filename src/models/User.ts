import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';

const UserSchema = new mongoose.Schema({
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
  },
  birth: {
    type: Number,
    required: true,
  },
  notice_agreement: {
    type: Boolean,
  },
  access_token: {
    type: String,
  },
});

export default mongoose.model<IUser & mongoose.Document>('User', UserSchema);
