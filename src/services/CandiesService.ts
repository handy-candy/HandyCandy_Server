import {
  userDto,
  candyDto,
  newCandyDto,
  addDateCandyDto,
  completedCandyDto,
  modifyCandyDto,
  moidfyImageDto,
  addCandyCategoryDto,
  monthlyCompletedCandyDto,
  monthlyCategoryCompletedCandyDto,
  yearlyCompletedCandyDto,
} from '../dto/candies.dto';
import Candy from '../models/Candy';
import Category from '../models/Category';
import Mail from '../models/Mail';
import { mailDto } from '../dto/mail.dto';
const mailContent = require('./../lib/mailContent');
import User from '../models/User';
import fetch from 'node-fetch-npm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dayjs from 'dayjs';

export class CandiesService {
  static async comingCandy(user_dto: userDto) {
    try {
      const today = new Date();
      const candies = await Candy.find({
        user_id: user_dto.user_id,
        reward_planned_at: { $gte: new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0)) },
        reward_completed_at: { $lte: new Date(Date.UTC(1111, 10, 13, 0, 0, 0)) },
      }).sort({ reward_planned_at: 1 });

      /*
      const candy_array = await {
        coming_candy: candies.map((v) => {
          const planned_date = v.reward_planned_at;
          let d_day;
          if (planned_date.getTime() - today.getTime() < 0) {
            d_day = Math.floor((today.getTime() - planned_date.getTime()) / (1000 * 3600 * 24));
            d_day *= -1;
          } else {
            d_day = Math.floor((planned_date.getTime() - today.getTime()) / (1000 * 3600 * 24));
          }
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            d_day: d_day,
            category_name: v.category_id['name'],
            month: v.reward_planned_at.getMonth() + 1,
            date: v.reward_planned_at.getDate(),
          };
        }),
      };
*/

      let candy_array = [];
      let negative = [];

      for (const candy of candies) {
        let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'] };
        const category_id = await candy['category_id'];
        const category = await Category.findById(category_id);
        const planned_date = candy['reward_planned_at'];
        const day = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        let d_day;
        if (planned_date.getTime() - day.getTime() < 0) {
          d_day = Math.floor((day.getTime() - planned_date.getTime()) / (1000 * 3600 * 24));
          d_day *= -1;
        } else {
          d_day = Math.floor((planned_date.getTime() - day.getTime()) / (1000 * 3600 * 24));
        }

        data['category_image_url'] = category['category_image_url'];
        data['category_name'] = category['name'];
        data['d_day'] = d_day;
        data['month'] = planned_date.getMonth() + 1;
        data['date'] = planned_date.getDate();

        if (d_day < 0) {
          negative.push(data);
        } else {
          candy_array.push(data);
        }
      }
      candy_array.push(negative);

      const result = await {
        comming_candy_count: candies.length,
        comming_candy: candy_array,
      };
      return result;
    } catch (err) {
      return {
        message: 'Server Error',
      };
    }
  }

  static async deleteCandy(candy_dto: candyDto) {
    try {
      const candy = await Candy.findById(candy_dto.candy_id);
      const AWS = require('aws-sdk');

      AWS.config.loadFromPath('./aws.config.json');
      const s3 = new AWS.S3();

      if (!candy) {
        return {
          message: 'Candy not found',
        };
      }
      if (candy.user_id.toString() !== candy_dto.user_id.toString()) {
        return { message: 'User not Authorized' };
      }
      if (candy['candy_image_url'].length) {
        const bucket_key = candy['candy_image_url'].slice(-16);
        s3.deleteObject(
          {
            Bucket: 'handycandy-bucket',
            Key: bucket_key,
          },
          (error, data) => {
            if (error) {
              return 'Server Error';
            }
          },
        );
      }

      await candy.remove();

      const result = '????????? ?????????????????????.';
      return result;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return {
        message: 'Server Error',
      };
    }
  }

  static async recommendCandy() {
    try {
      const result = await [
        {
          candy_name: '????????? ?????? ????????????',
          candy_image_url: 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/recommendCandy/hanriver.png',
          tag_name: '??????????????? ?????????, ?????? ????????????!',
        },
        {
          candy_name: '?????? ????????????',
          candy_image_url: 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/recommendCandy/baskin.png',
          tag_name: '????????? ???????????? ???????????????! ',
        },
        {
          candy_name: '??? ?????? ????????????',
          candy_image_url: 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/recommendCandy/walking.png',
          tag_name: '????????? ?????? ???????????? ???????????????!',
        },
      ];

      return result;
    } catch (err) {
      return {
        message: 'Server Error',
      };
    }
  }

  static async getImageUrl(ret: string) {
    const AWS = require('aws-sdk');
    const fs = require('fs');

    AWS.config.loadFromPath('aws.config.json');
    const s3 = new AWS.S3();

    let url = '';

    const uploadImageToS3 = (ret, fileName) => {
      return new Promise((resolve, reject) => {
        fetch(ret).then((res) => {
          res.body.pipe(fs.createWriteStream('temp.jpg')).on('finish', (data) => {
            const param = {
              Bucket: 'sopt-join-seminar',
              Key: (Math.floor(Math.random() * 1000).toString() + Date.now()).toString(),
              ACL: 'public-read',
              Body: fs.createReadStream('temp.jpg'),
              ContentType: 'image/jpg',
            };
            s3.upload(param, (error, data) => {
              if (error) {
                return 'Server Error';
              }
              url = data['Location'];
            });
          });
        });
      });
    };
  }

  static async addCandy(newCandy_dto: newCandyDto) {
    try {
      const now = new Date();
      const AWS = require('aws-sdk');
      const fs = require('fs');

      AWS.config.loadFromPath('./aws.config.json');
      const s3 = new AWS.S3();

      let url = '';
      let ret;

      // DB??? ????????? ?????????
      const newCandy = new Candy({
        name: '',
        shopping_link: newCandy_dto.shopping_link,
        user_id: newCandy_dto.user_id,
        shopping_link_name: '',
        shopping_link_image: '',
        candy_image_url: '',
        reward_planned_at: new Date(Date.UTC(1111, 11, 1, 0, 0, 0)),
        reward_completed_at: new Date(Date.UTC(1111, 11, 1, 0, 0, 0)),
        category_id: null,
        price: -1,
      });

      const candy = await newCandy.save();

      // ?????? ?????? ??? ????????? ??????
      let candy_name = '';
      let candy_image = '';

      // ?????????
      if (newCandy_dto.shopping_link.length) {
        ret = await CandiesService.crawler(newCandy_dto.shopping_link);
        candy_name = ret['title'];

        const saveMailContent = async (candy_image) => {
          // ??????DB??? ?????? ?????? ??????

          // ?????? ??????
          let now = dayjs();
          now = now.set('hour', 0);
          now = now.set('minute', 0);
          now = now.set('second', 0);
          now = now.set('millisecond', 0);
          let after18day = now.add(18, 'day');
          let after2month = now.add(2, 'month');

          // ????????? ?????? ?????????
          const user_name = (await User.findById(newCandy_dto.user_id)).nickname;

          const candy_link = newCandy_dto.shopping_link;
          const handycandy_link = 'https://www.handycandy.kr/';

          // 18??? ??? ??????

          let after18dayMail = await mailContent.saveAfter18day(
            after18day.get('month') + 1,
            after18day.get('date'),
            user_name,
            candy_name,
            candy_image,
            candy_link,
            handycandy_link,
          );

          let newMail = new Mail({
            user_id: newCandy_dto.user_id,
            candy_id: candy['_id'],
            user_name,
            title: after18dayMail.title,
            content: after18dayMail.content,
            send_date: after18day,
            is_sent: false,
          });
          after18dayMail = await newMail.save();

          // 2?????? ??? ??????
          let after2monthMail = mailContent.saveAfter2month(
            after2month.get('month') + 1,
            after2month.get('date'),
            user_name,
            candy_name,
            candy_image,
            candy_link,
            handycandy_link,
          );
          newMail = new Mail({
            user_id: newCandy_dto.user_id,
            candy_id: candy['_id'],
            user_name,
            title: after2monthMail.title,
            content: after2monthMail.content,
            send_date: after2month,
            is_sent: false,
          });
          after2monthMail = await newMail.save();
        };

        // ???????????? ????????? ?????? ????????????, ?????? ?????? ??? ????????? ????????? ????????????
        saveMailContent('');

        if (ret['image'].length) {
          new Promise((resolve, reject) => {
            fetch(ret['image']).then((res) => {
              res.body.pipe(fs.createWriteStream('temp.jpg')).on('finish', (data) => {
                const param = {
                  Bucket: 'handycandy-bucket',
                  Key: (Math.floor(Math.random() * 1000).toString() + Date.now()).toString(),
                  ACL: 'public-read',
                  Body: fs.createReadStream('temp.jpg'),
                  ContentType: 'image/jpg',
                };

                s3.upload(param, async (error, data) => {
                  if (error) {
                    return 'Server Error';
                  }
                  url = data['Location'];
                  candy['candy_image_url'] = url;
                  candy_image = url;
                  // ~~ ?????? user_id, candy_id??? ???????????? ????????? ??????
                  // user_id, candy_id??? ???????????? ????????? ????????????
                  const mail_array = await Mail.find({ user_id: newCandy_dto.user_id, candy_id: candy['_id'] });
                  // ???????????? ?????? ??????
                  if (mail_array) {
                    for (const mail of mail_array) {
                      mail.remove();
                    }
                  }
                  saveMailContent(candy_image);
                  candy['name'] = ret['title'];
                  candy['shopping_link_name'] = ret['siteName'];
                  candy['shopping_link_image'] = ret['icon'];
                  await candy.save();
                });
              });
            });
          });

          const result = await {
            candy_id: candy['_id'],
          };
          return result;
        } else {
          return '???????????? ?????? ??? ????????????.';
        }
      } else {
        return '????????? ??????????????????';
      }
    } catch (err) {
      console.log(err);
      return { message: 'Server Error' };
    }
  }

  static async addDateCandy(addDateCandy_dto: addDateCandyDto) {
    try {
      const candy = await Candy.findById(addDateCandy_dto.candy_id);

      if (!candy) {
        return { message: 'Candy not found' };
      }
      if (candy.user_id.toString() !== addDateCandy_dto.user_id.toString()) {
        return { message: 'User not Authorized' };
      }

      const planned_date = new Date(
        Date.UTC(addDateCandy_dto.year, addDateCandy_dto.month - 1, addDateCandy_dto.date, 0, 0, 0),
      );
      candy['reward_planned_at'] = planned_date;

      await candy.save();

      // ~~ ?????? user_id, candy_id??? ???????????? ????????? ??????
      // user_id, candy_id??? ???????????? ????????? ????????????
      const mail_array = await Mail.find({ user_id: addDateCandy_dto.user_id, candy_id: addDateCandy_dto.candy_id });
      // ???????????? ?????? ??????
      if (mail_array) {
        for (const mail of mail_array) {
          mail.remove();
        }
      }

      // ~~ ????????? ????????? ?????? ??????
      const user_id = addDateCandy_dto.user_id;
      const user_name = (await User.findById(user_id)).nickname;
      const candy_id = addDateCandy_dto.candy_id;
      const candy_link = candy.shopping_link;
      const candy_name = candy.name;
      const candy_image = candy.candy_image_url;
      const handycandy_link = 'https://www.handycandy.kr/';

      const Dday = dayjs(planned_date);
      const before2day = Dday.subtract(2, 'day');

      // ????????? ?????? 2??? ???

      let before2dayMail = mailContent.before2day(
        before2day.get('month') + 1,
        before2day.get('date'),
        user_name,
        candy_name,
        candy_image,
        candy_link,
        handycandy_link,
      );

      let newMail = new Mail({
        user_id: user_id,
        candy_id: candy_id,
        user_name,
        title: before2dayMail.title,
        content: before2dayMail.content,
        send_date: before2day,
        is_sent: false,
      });
      before2dayMail = await newMail.save();

      // ?????? ??????
      let DdayMail = mailContent.Dday(
        Dday.get('month') + 1,
        Dday.get('date'),
        user_name,
        candy_name,
        candy_image,
        candy_link,
        handycandy_link,
      );
      newMail = new Mail({
        user_id: user_id,
        candy_id: candy_id,
        user_name,
        title: DdayMail.title,
        content: DdayMail.content,
        send_date: Dday,
        is_sent: false,
      });
      DdayMail = await newMail.save();

      const result = '?????? ????????? ?????????????????????.';
      return result;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return { message: 'Server Error' };
    }
  }

  static async rewardCandy(candy_dto: candyDto) {
    try {
      const candy = await Candy.findById(candy_dto.candy_id);
      console.log(candy);
      if (!candy) {
        return { message: 'Candy not found' };
      }
      if (candy.user_id.toString() !== candy_dto.user_id.toString()) {
        return { message: 'User not Authorized' };
      }

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const date = today.getDate();

      candy['reward_completed_at'] = new Date(Date.UTC(year, month, date, 0, 0, 0));
      await candy.save();

      // ~~ ????????? ????????? ?????? ??????
      const user_id = candy_dto.user_id;
      const user_name = (await User.findById(user_id)).nickname;
      const candy_id = candy_dto.candy_id;
      const candy_link = candy.shopping_link;
      const candy_name = candy.name;
      const candy_image = candy.candy_image_url;
      const handycandy_link = 'https://www.handycandy.kr/';

      const after7day = dayjs().add(7, 'day');

      // ~~ ?????? user_id, candy_id??? ???????????? ????????? ??????
      // user_id, candy_id??? ???????????? ????????? ????????????
      const mail_array = await Mail.find({ user_id: user_id, candy_id: candy_id });
      // ???????????? ?????? ??????
      if (mail_array) {
        for (const mail of mail_array) {
          mail.remove();
        }
      }

      // ????????? ?????? 7??? ???

      let rewardAfter7dayMail = mailContent.rewardAfter7day(
        after7day.get('month') + 1,
        after7day.get('date'),
        user_name,
        candy_name,
        candy_image,
        candy_link,
        handycandy_link,
      );

      let newMail = new Mail({
        user_id: user_id,
        candy_id: candy_id,
        user_name,
        title: rewardAfter7dayMail.title,
        content: rewardAfter7dayMail.content,
        send_date: after7day,
        is_sent: false,
      });
      rewardAfter7dayMail = await newMail.save();

      return {
        message: '????????? ?????????????????????',
      };
    } catch (err) {
      return {
        message: 'Server Error',
      };
    }
  }

  static async monthlyCompletedCandy(monthlyCompletedCandy_dto: monthlyCompletedCandyDto) {
    const monthlyCandyList = await Candy.find({
      user_id: monthlyCompletedCandy_dto.user_id,
      reward_completed_at: {
        $lt: new Date(Date.UTC(monthlyCompletedCandy_dto.year, monthlyCompletedCandy_dto.month, 1, 0, 0, 0)),
        $gte: new Date(Date.UTC(monthlyCompletedCandy_dto.year, monthlyCompletedCandy_dto.month - 1, 1, 0, 0, 0)),
      },
    })
      .populate('category_id')
      .sort({ reward_completed_at: 1 });

    const today = new Date();
    const day = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));

    const candy_array = await {
      result: monthlyCandyList.map((v) => {
        let category_image_url = '';
        let category_name = '';
        if (v.category_id != null) {
          category_image_url = v.category_id['category_image_url'];
          category_name = v.category_id['name'];
        }
        return {
          candy_id: v._id,
          candy_image_url: v.candy_image_url,
          candy_name: v.name,
          category_image_url: category_image_url,
          category_name: category_name,
          shopping_link_name: v.shopping_link_name,
          shopping_link_image: v.shopping_link_image,
          year: v.reward_completed_at.getFullYear(),
          month: v.reward_completed_at.getMonth() + 1,
          date: v.reward_completed_at.getDate(),
        };
      }),
    };

    return {
      count: candy_array['result'].length,
      candy_array: candy_array['result'],
    };
  }

  static async yearlyCompletedCandy(yearlyCompletedCandy_dto: yearlyCompletedCandyDto) {
    const yearlyCandyList = await Candy.find({
      user_id: yearlyCompletedCandy_dto.user_id,
      reward_completed_at: {
        $lt: new Date(Date.UTC(yearlyCompletedCandy_dto.year + 1, 0, 1, 0, 0, 0)),
        $gte: new Date(Date.UTC(yearlyCompletedCandy_dto.year, 0, 1, 0, 0, 0)),
      },
    })
      .populate('category_id')
      .sort({ reward_completed_at: 1 });

    var monthlyCnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var highestMonth = 0;

    yearlyCandyList.map((v) => {
      const month = v.reward_completed_at.getMonth();
      monthlyCnt[month]++;
    });

    var sum = 0;
    for (var i = 0; i < 12; i++) {
      sum += monthlyCnt[i];
      if (highestMonth < monthlyCnt[i]) {
        highestMonth = i;
      }
    }
    return {
      count: sum,
      montlyCandyCnt: monthlyCnt,
      highestMonth: highestMonth + 1,
    };
  }
  static async monthlyCategoryCompletedCandy(monthlyCategoryCompletedCandy_dto: monthlyCategoryCompletedCandyDto) {
    const monthlyCandyList = await Candy.find({
      user_id: monthlyCategoryCompletedCandy_dto.user_id,
      category_id: monthlyCategoryCompletedCandy_dto.category_id,
      reward_completed_at: {
        $lt: new Date(
          Date.UTC(monthlyCategoryCompletedCandy_dto.year, monthlyCategoryCompletedCandy_dto.month, 1, 0, 0, 0),
        ),
        $gte: new Date(
          Date.UTC(monthlyCategoryCompletedCandy_dto.year, monthlyCategoryCompletedCandy_dto.month - 1, 1, 0, 0, 0),
        ),
      },
    })
      .populate('category_id')
      .sort({ reward_completed_at: -1 });

    const today = new Date();
    const day = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));

    const candy_array = await {
      result: monthlyCandyList.map((v) => {
        let category_image_url = '';
        let category_name = '';
        if (v.category_id != null) {
          category_image_url = v.category_id['category_image_url'];
          category_name = v.category_id['name'];
        }
        return {
          candy_id: v._id,
          candy_image_url: v.candy_image_url,
          candy_name: v.name,
          category_image_url: category_image_url,
          category_name: category_name,
          shopping_link_name: v.shopping_link_name,
          shopping_link_image: v.shopping_link_image,
          year: v.reward_completed_at.getFullYear(),
          month: v.reward_completed_at.getMonth() + 1,
          date: v.reward_completed_at.getDate(),
        };
      }),
    };

    return {
      count: candy_array['result'].length,
      candy_array: candy_array['result'],
    };
  }

  static async completedCandy(completedCandy_dto: completedCandyDto) {
    /*
      let category_num = [];

      const candies = await {
        1: january_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        2: february_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        3: march_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        4: april_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        5: may_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        6: june_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        7: july_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        8: august_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        9: sep_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        10: oct_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        11: nov_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
        12: dec_candy.map((v) => {
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            year: v.reward_completed_at.getFullYear(),
            month: v.reward_completed_at.getMonth() + 1,
            date: v.reward_completed_at.getDate(),
          };
        }),
      };

      for (let step = 1; step <= 12; step++) {
        let data = candies[String(step)];
        let categories = [];
        for (let i = 0; i < data.length; i++) {
          categories.push(data[i]['category_image_url']);
        }
        category_num.push(new Set(categories).size);
      }
      const result = await {
        category_num: category_num,
        user_nickname: user_nickname['nickname'],
        monthly_candies: candies,
      };
*/
    try {
      const candies = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: { $gt: new Date(Date.UTC(1111, 11, 1, 0, 0, 0)) },
      });

      const today = new Date();
      const day = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));

      const candy_array = await {
        result: candies.map((v) => {
          let waiting_date = 0;
          let month = 0;
          let date = 0;
          let d_day = 0;
          if (v.reward_planned_at.getFullYear() == 1111) {
          } else {
            const planned_date = v.reward_planned_at;
            month = planned_date.getMonth() + 1;
            date = planned_date.getDate();
            if (planned_date.getTime() - day.getTime() < 0) {
              d_day = Math.floor((day.getTime() - planned_date.getTime()) / (1000 * 3600 * 24));
              d_day *= -1;
            } else {
              d_day = Math.floor((planned_date.getTime() - day.getTime()) / (1000 * 3600 * 24));
            }
          }
          let category_image_url = '';
          let category_name = '';
          if (v.category_id != null) {
            category_image_url = v.category_id['category_image_url'];
            category_name = v.category_id['name'];
          }
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: category_image_url,
            category_name: category_name,
            waiting_date: waiting_date,
            d_day: d_day,
            month: month,
            date: date,
          };
        }),
      };

      return {
        count: candy_array['result'].length,
        candy_array: candy_array['result'],
      };
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return {
        message: 'Server Error',
      };
    }
  }

  /*
  static async modifyCompletedCandy(modifyCompletedCandy_dto: modifyCompletedCandyDto) {
    try {
      const { review_id, candy_name, feeling, message } = modifyCompletedCandy_dto;

      const review = await Review.findById(review_id);
      if (!review) {
        return { message: 'Review not found' };
      }
      const candy = await Candy.findById(review['candy_id']);

      if (candy.user_id.toString() !== modifyCompletedCandy_dto.user_id.toString()) {
        return { message: 'User not Authorized' };
      }
      candy['name'] = candy_name;
      review['feeling'] = feeling;
      review['message'] = message;

      await review.save();
      await candy.save();

      const result = '?????? ????????? ?????????????????????.';

      return result;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return { message: 'Server Error' };
    }
  }
*/
  static async reviewCandy(review_dto: candyDto) {
    try {
      const today = new Date();
      const candy = await Candy.findById(review_dto.candy_id);
      if (!candy) {
        return { message: 'Candy not found' };
      }
      if (candy.user_id.toString() !== review_dto.user_id.toString()) {
        return { error: 'User not Authorized' };
      }
      const category = await Category.findById(candy['category_id']);
      const result = await {
        candy_image_url: candy['candy_image_url'],
        category_name: category['name'],
        candy_name: candy['name'],
        detail_info: candy['detail_info'],
        shopping_link: candy['shopping_link'],
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        date: today.getDate(),
      };

      return result;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return {
        message: 'Server Error',
      };
    }
  }

  static async detailCompletedCandies(detailCompletedCandies_dto: candyDto) {
    try {
      const candy = await Candy.findById(detailCompletedCandies_dto.candy_id);
      if (!candy) {
        return { message: 'Candy not found' };
      }
      const category = await Category.findById(candy['category_id']);

      if (candy.user_id.toString() !== detailCompletedCandies_dto.user_id.toString()) {
        return { message: 'User not Authorized' };
      }

      const result = await {
        year: candy['reward_completed_at'].getFullYear(),
        month: candy['reward_completed_at'].getMonth() + 1,
        date: candy['reward_completed_at'].getDate(),
        category_name: category['name'],
        candy_name: candy['name'],
        candy_image_url: candy['candy_image_url'],
        detail_info: candy['detail_info'],
        message: candy['message'],
        banner: category['category_image_url'],
        shopping_link: candy['shopping_link'],
      };

      return result;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return {
        message: 'Server Error',
      };
    }
  }

  static async modifyCandy(modifyCandy_dto: modifyCandyDto) {
    try {
      const { user_id, candy_id, candy_name, price } = modifyCandy_dto;

      const candy = await Candy.findById(candy_id);

      if (!candy) {
        return { message: 'candy not found' };
      }
      if (candy.user_id.toString() !== user_id.toString()) {
        return { error: 'User not Authorized' };
      }

      candy['name'] = candy_name;
      candy['price'] = price;

      await candy.save();
      const result = await '?????? ?????? ????????? ?????????????????????.';
      return result;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return {
        message: 'Server Error',
      };
    }
  }

  static async crawler(url: string) {
    try {
      const DEFAULT_TITLE = 'title';
      const META_TITLE = 'meta[property="og:title"]';
      const META_URL = 'meta[property="og:url"]';
      const META_IMAGE = 'meta[property="og:image"]';
      const META_SITE_NAME = 'meta[property="og:site_name"]';
      const SHORTCUT_ICON = 'link[rel="shortcut icon"]';
      const ICON = 'link[rel="icon"]';

      const CONTENT = 'content';
      const HREF = 'href';

      const { data } = await axios(url);
      const $ = cheerio.load(data);

      // ????????? ?????? ??????
      const shopName = {
        'gmarket': 'G??????',
        '11st.co.kr': '11??????',
        'coupang': '??????',
        'smartstore.naver.com': '???????????????',
        'auction': '??????',
        'interpark': '????????????',
        'store.emart.com': '?????????',
        'ssg.com': 'SSG',
        'lotteon.com': '??????ON',
        'costco': '????????????',
        'homeplus': '????????????',
        'wemakeprice': '?????????',
        'tmon.co.kr': '??????',
        'musinsa': '?????????',
        'yes24.com': 'YES24',
        'aladin.co.kr': '?????????',
        'kyobobook.co.kr': '????????????',
        'ypbooks.co.kr': '????????????',
      };

      let foundSiteName = '';
      Object.keys(shopName).forEach((element) => {
        if (url.includes(element)) {
          foundSiteName = shopName[element];
        }
      });

      const defaultIcon = 'default icon path';

      return {
        title: $(META_TITLE).attr(CONTENT) || $(DEFAULT_TITLE).text() || '',
        url: $(META_URL).attr(CONTENT) || '',
        image: $(META_IMAGE).attr(CONTENT) || '/assets/images/defaultThumbnail.svg',
        siteName: foundSiteName || $(META_SITE_NAME).attr(CONTENT) || '',
        icon: $(SHORTCUT_ICON).attr(HREF) || $(ICON).attr(HREF) || defaultIcon,
      };
    } catch (err) {
      return {
        message: 'Server Error',
      };
    }
  }
  static async modifyImage(modifyImage_dto: moidfyImageDto) {
    try {
      const candy = await Candy.findById(modifyImage_dto.candy_id);
      const AWS = require('aws-sdk');

      AWS.config.loadFromPath('aws.config.json');
      const s3 = new AWS.S3();
      if (!candy) {
        return { message: 'Review not found' };
      }
      if (candy.user_id.toString() !== modifyImage_dto.user_id.toString()) {
        return { message: 'User not Authorized' };
      }

      let result = '?????? ???????????? ?????????????????????.';

      if (candy['candy_image_url'].length) {
        const bucket_key = candy['candy_image_url'].slice(-16);
        s3.deleteObject(
          {
            Bucket: 'sopt-join-seminar',
            Key: bucket_key,
          },
          (error, data) => {
            if (error) {
              result = 'Server Error';
              return result;
            }
          },
        );
      }

      candy['candy_image_url'] = modifyImage_dto.candy_image_url;
      await candy.save();
      return candy['candy_image_url'];
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return {
        message: 'Server Error',
      };
    }
  }

  static async getAllCandies(completedCandy_dto: completedCandyDto) {
    try {
      const candies = await Candy.find({
        user_id: completedCandy_dto.user_id,
      });

      const today = new Date();
      const day = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));

      const candy_array = await {
        result: candies.map((v) => {
          let waiting_date = 0;
          let month = 0;
          let date = 0;
          let d_day = 0;
          if (v.reward_planned_at.getFullYear() == 1111) {
          } else {
            const planned_date = v.reward_planned_at;
            month = planned_date.getMonth() + 1;
            date = planned_date.getDate();
            if (planned_date.getTime() - day.getTime() < 0) {
              d_day = Math.floor((day.getTime() - planned_date.getTime()) / (1000 * 3600 * 24));
              d_day *= -1;
            } else {
              d_day = Math.floor((planned_date.getTime() - day.getTime()) / (1000 * 3600 * 24));
            }
          }
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            category_name: v.category_id['name'],
            waiting_date: waiting_date,
            d_day: d_day,
            month: month,
            date: date,
          };
        }),
      };

      return candy_array['result'];
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return {
        message: 'Server Error',
      };
    }
  }

  static async addCandyCategory(candy_dto: addCandyCategoryDto) {
    try {
      const category = await Category.find({
        user_id: candy_dto.user_id,
        name: candy_dto.category_name,
      });

      const candy = await Candy.findById(candy_dto.candy_id);

      if (!category.length) {
        const newCategory = new Category({
          name: candy_dto.category_name,
          user_id: candy_dto.user_id,
          category_image_url: candy_dto.category_image_url,
        });

        const new_category = await newCategory.save();

        candy['category_id'] = new_category['_id'];
        await candy.save();
      } else {
        candy['category_id'] = category[0]['_id'];
        await candy.save();
      }
      return {
        message: '????????? ??????????????? ?????????????????????.',
      };
    } catch (err) {
      return {
        message: 'Server Error',
      };
    }
  }
}
