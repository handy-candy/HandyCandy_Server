import express from 'express';
import connectDB from './Logger/db';
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const corsOptions = {
  origin: 'http://localhost:3000', // 허락하고자 하는 요청 주소
  credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};
// Connect Database
connectDB();
app.use(cors(corsOptions));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.json());
app.use('/api/candies', require('./api/candies'));
app.use('/api/userInfo', require('./api/userInfo'));
app.use('/api/users', require('./api/user'));
app.use('/api/category', require('./api/category'));
app.use('/api/candy', require('./api/candy'));

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
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
