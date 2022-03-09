import express, { Request, Response, NextFunction } from 'express';
import router from './api';
import connectDB from './Logger/db';
import session from 'express-session'

import passport from 'passport';
const passportConfig = require('./passport');

const cors = require('cors');
const app = express();
passportConfig(); // 패스포트 설정
const cookieParser = require('cookie-parser');
app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');
  next();
});
// Connect Database
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
   session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
         httpOnly: true,
         secure: false,
      },
   }),
);
//! express-session에 의존하므로 뒤에 위치해야 함
app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장
// passport.session()이 실행되면, 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 한다.

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.send(err);
  console.log(err)
});
app
  .listen(5000, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: 5000 🛡️
    ################################################
  `);
  })
  .on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
