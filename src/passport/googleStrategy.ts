const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import { SignInDto, SignUpDto, GoogleSignUpDto } from '../dto/user.dto';
import User from '../models/User';

module.exports = () => {
   passport.use(
      new GoogleStrategy(
         {
            clientID: process.env.GOOGLE_ID, // 구글 로그인에서 발급받은 REST API 키
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'https://www.handycandy.cf/api/users/google/callback', // 구글 로그인 Redirect URI 경로
            // callbackURL: 'http://localhost:5000/api/users/google/callback', // 구글 로그인 Redirect URI 경로
         },
         // profile: 획득한 구글 프로필
         async (accessToken, refreshToken, profile, done) => {

            try {
               const exUser = await User.findOne({
                  // 구글 플랫폼에서 로그인 했고 & snsId필드에 구글 아이디가 일치할경우
                  sns_id: profile.id, provider: 'google'
               });

               // 이미 가입된 구글 프로필이면 성공
               if (exUser) {
                  done(null, exUser); // 로그인 인증 완료
               } else {
                  // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다

                  const signup_dto: GoogleSignUpDto = {
                    email: profile.emails[0].value,
                    nickname: profile.displayName,
                    sns_id: profile.id,
                    provider: 'google',
                  };

                  const newUser = await User.create(signup_dto);
                  done(null, newUser); // 회원가입하고 로그인 인증 완료
               }
            } catch (error) {
               console.error(error);
               done(error);
            }
         },
      ),
   );
};
