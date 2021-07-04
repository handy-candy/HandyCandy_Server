export interface IUser {
  id: number;
  email: string;
  password: string;
  salt: string;
  nickname: string;
  gender: number;
  birth: number;
  personal_info_agreement: boolean;
  notice_agreement: boolean;
  access_token: string;
  refresh_token: string;
}
