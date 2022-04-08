import express from 'express';
import { check } from 'express-validator';
import { signIn, signUp, googleLoginInfo, googleLogin, googleCallback} from '../controllers';
import passport from 'passport';
const router = express.Router();
import config from '../config';
import jwt from 'jsonwebtoken';
const check_signup = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('nickname', 'Name is required').not().isEmpty(),
  check('gender', 'Gender is required').not().isEmpty(),
  check('birth', 'Birth is required').not().isEmpty(),
  check('notice_agreement', 'Notice agreement is required').not().isEmpty(),
];

const check_signin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

router.post('/signUp', check_signup, signUp);

router.post('/signIn', check_signin, signIn);


//* 구글로 로그인하기 라우터 ***********************

// 프로필과 이메일 정보를 받는다.
// router.get('/google', googleLoginInfo); 
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));



//위에서 구글 서버 로그인이 되면, redirect url 설정에 따라 이쪽 라우터로 오게 된다. 인증 코드를 박게됨
router.get(
   '/google/callback',
   passport.authenticate('google', { failureRedirect: '/api/users/signUp' }), // 그리고 passport 로그인 전략에 의해 googleStrategy로 가서 구글계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
   googleCallback
);

module.exports = router;
