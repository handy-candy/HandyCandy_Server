import express, { Request, Response, NextFunction } from 'express';
import connectDB from './Logger/db';
const cors = require('cors');
const app = express();
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
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.json());
app.use(cookieParser());
app.use('/api/candies', require('./api/candies'));
app.use('/api/userInfo', require('./api/userInfo'));
app.use('/api/users', require('./api/user'));
app.use('/api/category', require('./api/category'));
app.use('/api/candy', require('./api/candy'));

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
