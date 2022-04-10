import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { SignInDto, SignUpDto, GoogleSignInDto  } from '../dto/user.dto';
import { UserService } from '../services';

export const signUp = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const signup_dto: SignUpDto = {
    email: req.body.email,
    password: req.body.password,
    nickname: req.body.nickname,
    gender: req.body.gender,
    birth: req.body.birth,
    notice_agreement: req.body.notice_agreement,
    provider: req.body.provider,
  };

  const result = await UserService.signUp(signup_dto);

  if (result.message === 'User already exists') {
    return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
  } else if (result.message === 'Server Error') {
    res.status(500).send('Server Error');
  } else {
    res.status(200).json({ token: result });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const signin_dto: SignInDto = {
    email: req.body.email,
    password: req.body.password,
  };

  const result = await UserService.signIn(signin_dto);
  if (result.message === 'Invalid Credentials') {
    return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
  } else if (result.message === 'Server Error') {
    res.status(500).send('Server Error');
  } else {
    res.status(200).json({ token: result });
  }
};


// 구글 소셜로그인 회원가입 콜백
export const googleCallback = async (req: Request, res: Response) => {

  const signin_dto: GoogleSignInDto = {
    user_id: req.user.id
  };

  // passport 로그인 전략에 의해 googleStrategy로 가서 구글계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  const result = await UserService.googleCallback(signin_dto);
  if (result.message === 'Server Error') {
    res.status(500).send('Server Error');
  } else {
    // 성공
    res.json({login: "success", result});
  }
};
