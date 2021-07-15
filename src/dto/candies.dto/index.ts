export interface comingCandyDto {
  user_id: String;
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
