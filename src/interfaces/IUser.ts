import mongoose from "mongoose";

export interface IUser {
 
  id: number;
  email: string;
  password: string;
  salt: string;
  nickname: string;
  gender: number;
  age: number;
  personal_info_agreement: boolean;
  alarm_agreement: boolean;
  access_token: string;
  refresh_token: string;

}
