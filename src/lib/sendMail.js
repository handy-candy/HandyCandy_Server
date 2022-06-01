const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const schedule = require('node-schedule');
const dotenv = require('dotenv');
dotenv.config();

import Mail from '../models/Mail';
import User from '../models/User';

import dayjs from 'dayjs';

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_USER = process.env.GMAIL_USER;


// 구글 oauth2
const oAuth2Client = new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

async function sendMail(to, title, content) {
  try {
    const accesstoken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken: accesstoken,
      },
    });

    const mailOptions = {
      from: `핸디캔디<${GMAIL_USER}>`,
      to,
      subject: `${title}`,
      text: `${content}`,
      html: `${content}`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}


async function scheduleLogic() {

  console.log("1:00 - send mail");

  // 현재 시각
  let now = dayjs();
  const year = now.get("year");
  const month = now.get("month");
  // const date = now.get("date");
  now = now.set("hour", 0);
  now = now.set("minute", 0);
  now = now.set("second", 0);
  now = now.set("millisecond", 0);

  // 오늘 날짜랑 같고, is_sent가 false인 메일들
  const mail_array = (await Mail.find({
    "send_date": {
      $gte: now.toISOString(), 
      $lt: now.add(1, 'day').toISOString()}, 
      "is_sent": false
  }));


  const sendedMailList = await Promise.all(
      mail_array.map(async (mail) => {
          const email = (await User.findById(mail.user_id)).email;
          sendMail(email, mail.title, mail.content)
          mail['is_sent'] = true;
          await mail.save();          

    }),
  );

}

module.exports = {
    // 시간 되면 메일 보내줌
    mailSchedule: async () => {
      
        console.log("mailSchedule start!")
        // 매일 1시에 실행
        try{
          const job = schedule.scheduleJob('0 0 1 * * *', scheduleLogic)
        } catch (err) {
          console.log(err);
        }

    }
}