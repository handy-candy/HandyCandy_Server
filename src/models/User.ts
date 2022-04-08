/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - email
 *          - nickname
 *        properties:
 *          email:
 *            type: String
 *            format: email
 *            description: unique
 *          password:
 *            type: String
 *          salt:
 *            type: String
 *          nickname:
 *            type: String
 *          gender:
 *            type: Number
 *          birth:
 *            type: Number
 *          notice_agreement:
 *            type: Boolean
 *          sns_id:
 *            type: String
 *          provider:
 *            type: String
 */


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
  sns_id: {
    type: String,
  },
  provider: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser & mongoose.Document>('User', UserSchema);
