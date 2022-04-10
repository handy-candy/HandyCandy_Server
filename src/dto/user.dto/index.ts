export interface SignUpDto {
  email: string;
  password: string;
  nickname: string;
  gender: number;
  birth: number;
  notice_agreement: boolean;
  provider: string;
}

export interface SignUpResultDto {
  token: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignInResultDto {
  token: string;
}

export interface GoogleSignUpDto {
  email: string;
  // password: string;
  nickname: string;
  // gender: number;
  // birth: number;
  // notice_agreement: boolean;
  sns_id: string;
  provider: string;
}

export interface GoogleSignInDto {
  user_id: string;
  // email: string;
}