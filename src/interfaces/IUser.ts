export interface IUser {
  email: string;
  password?: string;
  salt?: string;
  nickname: string;
  gender?: number;
  birth?: number;
  notice_agreement?: boolean;
  access_token?: string;
}
