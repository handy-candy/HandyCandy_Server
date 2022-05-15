const passport = require('passport');
// const local = require('./localStrategy'); // 로컬서버로 로그인할때
const google = require('./googleStrategy'); // 구글서버로 로그인할때

const User = require('./../models/User');

module.exports = () => {
  /*
   * ㅇ 직렬화(Serialization) : 객체를 직렬화하여 전송 가능한 형태로 만드는 것.
   * ㅇ 역직렬화(Deserialization) : 직렬화된 파일 등을 역으로 직렬화하여 다시 객체의 형태로 만드는 것.
   */

  //? req.login(user, ...) 가 실행되면, serializeUser가 실행된다. user값이 일로 와서 값을 이용한다.
  //? Oauth 로그인일경우 자체 Strategy에서 req.login을 호출하기 때문에, 뭘로 로그인하든 일로 온다.
  passport.serializeUser((user, done) => {
    done(null, user.id);
    //? req.session객체에 어떤 데이터를 저장할 지 선택. user.id를 세션객체에 넣음.
    // 사용자의 온갖 정보를 모두 들고있으면, 서버 자원낭비기 때문에 사용자 아이디만 저장
    // 그리고 데이터를 deserializeUser애 전달함
    // 세션에는 { id: 3, 'connect.sid' : s%23842309482 } 만 간단하게 저장되어 있음
  });

  //? deserializeUser는 serializeUser()가 done하거나 passport.session()이 실행되면 실행된다.
  //? 즉, 서버 요청이 올때마다 항상 실행하여 로그인 유저 정보를 불러와 이용한다.
  passport.deserializeUser((id, done) => {
    //? 두번 inner 조인해서 나를 팔로우하는 followerid와 내가 팔로우 하는 followingid를 가져와 테이블을 붙인다
    User.findOne({
      where: { id },
    })
      /*
         ~ select users.*, Followers.id, Followers.nick, Followings.id, Followings.nick, 
         ~ from users 
         ~ inner join follow as Followers on u1.id = Followers.followerId 
         ~ inner join follow as Followings on u1.id = Followings.followingId 
         ~ where users.id = ${id}
         */
      .then((user) => done(null, user)) //? done()이 되면 이제 다시 req.login(user, ...) 쪽으로 되돌아가 미들웨어를 실행하게 된다.
      .catch((err) => done(err));
  }); //~ deserializeUser()는 결국 req.user를 생성하는 메서드 일 뿐이다.

  //^ 위의 이러한 일련의 과정은, 그냥 처음부터 user객체를 통째로 주면 될껄 뭘 직렬화/역직렬화를 하는 이유는
  //^ 세션 메모리가 한정되어있기때문에 효율적으로 하기위해, user.id값 하나만으로 받아와서,
  //^ 이를 deserialize 복구해서 사용하는 식으로 하기 위해서다.

  /* ---------------------------------------------------------------------- */

  // local();
  //google(); // 구글 전략 등록
};
