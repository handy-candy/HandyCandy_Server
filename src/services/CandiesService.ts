import {
  userDto,
  candyDto,
  newCandyDto,
  addDateCandyDto,
  completedCandyDto,
  modifyCompletedCandyDto,
  reviewDto,
  modifyCandyDto,
  moidfyImageDto,
} from '../dto/candies.dto';
import Candy from '../models/Candy';
import Category from '../models/Category';
import Review from '../models/Review';
import User from '../models/User';
import Feeling from '../models/Feeling';
import fetch from 'node-fetch-npm';
import axios from 'axios';
import * as cheerio from 'cheerio';

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

  static async waitingCandy(user_dto: userDto) {
    try {
      const today = new Date();
      const day = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
      const candies = await Candy.find({
        user_id: user_dto.user_id,
        reward_planned_at: { $lte: new Date(Date.UTC(1111, 10, 13, 0, 0, 0)) },
        reward_completed_at: { $lte: new Date(Date.UTC(1111, 10, 13, 0, 0, 0)) },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ created_at: -1 });

      const candy_array = await {
        waiting_candy: candies.map((v) => {
          const created_date = v.created_at;
          return {
            candy_id: v._id,
            candy_image_url: v.candy_image_url,
            candy_name: v.name,
            category_image_url: v.category_id['category_image_url'],
            waiting_date: Math.floor(Math.abs(day.getTime() - created_date.getTime()) / (1000 * 3600 * 24)),
            category_name: v.category_id['name'],
          };
        }),
      };

      const result = await {
        waiting_candy_count: candy_array['waiting_candy'].length,
        waiting_candy: candy_array['waiting_candy'],
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
      if (!candy) {
        return {
          message: 'Candy not found',
        };
      }
      if (candy.user_id.toString() !== candy_dto.user_id.toString()) {
        return { message: 'User not Authorized' };
      }

      const review = await Review.findOne({ candy_id: candy_dto.candy_id });
      if (review) await review.remove();

      await candy.remove();

      const result = '캔디가 삭제되었습니다.';
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
          candy_name: '자전거 타고 한강가기',
          candy_image_url: 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/recommendCandy/hanriver.png',
          tag_name: '산들바람을 느끼며, 몸을 움직이자!',
        },
        {
          candy_name: '베라 쿼터먹기',
          candy_image_url: 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/recommendCandy/baskin.png',
          tag_name: '지나친 달콤함이 약이되기도! ',
        },
        {
          candy_name: '집 근처 산책하기',
          candy_image_url: 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/recommendCandy/walking.png',
          tag_name: '오전을 보다 상쾌하게 시작해보자!',
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

      AWS.config.loadFromPath('aws.config.json');
      const s3 = new AWS.S3();

      let url = '';
      let info = '';
      let ret;

      const newCandy = new Candy({
        name: newCandy_dto.candy_name,
        shopping_link: newCandy_dto.shopping_link,
        user_id: newCandy_dto.user_id,
        category_id: newCandy_dto.category_id,
        reward_planned_at: new Date(Date.UTC(1111, 10, 11, 0, 0, 0)),
        created_at: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)),
        message: '',
        detail_info: '',
        reward_completed_at: new Date(Date.UTC(1111, 10, 11, 0, 0, 0)),
        candy_image_url: '',
      });

      const candy = await newCandy.save();

      if (newCandy_dto.shopping_link.length) {
        ret = await CandiesService.crawler(newCandy_dto.shopping_link);

        info = ret['title'];
        if (newCandy_dto.detail_info.length) {
          info = newCandy_dto.detail_info;
        }

        if (ret['image'].length) {
          new Promise((resolve, reject) => {
            fetch(ret['image']).then((res) => {
              res.body.pipe(fs.createWriteStream('temp.jpg')).on('finish', (data) => {
                const param = {
                  Bucket: 'sopt-join-seminar',
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
                  candy['detail_info'] = info;
                  await candy.save();
                });
              });
            });
          });
        }
      }

      const category = await Category.findById(newCandy_dto.category_id);

      const result = await {
        candy_id: candy._id,
        category_name: category.name,
        candy_name: candy.name,
        category_image_url: category.category_image_url,
      };
      return result;
    } catch (err) {
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
      candy['message'] = addDateCandy_dto.message;

      await candy.save();

      const result = '보상 날짜가 등록되었습니다.';
      return result;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return { message: 'Server Error' };
    }
  }

  static async completedCandy(completedCandy_dto: completedCandyDto) {
    try {
      const today = new Date();
      const user_nickname = await User.findById(completedCandy_dto.user_id).select({ nickname: 1, _id: 0 });
      const january_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 1, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 0, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const february_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 2, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 1, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const march_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 3, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 2, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const april_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 4, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 3, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const may_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 5, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 4, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const june_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 6, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 5, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const july_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 7, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 6, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const august_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 8, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 7, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const sep_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 9, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 8, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const oct_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 10, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 9, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const nov_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 11, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 10, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

      const dec_candy = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), 12, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), 11, 1, 0, 0, 0)),
        },
      })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_completed_at: -1 });

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

      return result;
    } catch (err) {
      return {
        message: 'Server Error',
      };
    }
  }

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

      const result = '완료 캔디가 수정되었습니다.';

      return result;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Candy not found' };
      }
      return { message: 'Server Error' };
    }
  }

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

  static async addReview(review_dto: reviewDto) {
    try {
      const today = new Date();
      const candy = await Candy.findById(review_dto.candy_id);
      if (!candy) {
        return { message: 'Candy not found' };
      }
      const category = await Category.findById(candy['category_id']);

      const newReview = new Review({
        feeling: review_dto.feeling,
        message: review_dto.message,
        candy_id: review_dto.candy_id,
        category_id: category['_id'],
      });

      candy['reward_completed_at'] = new Date(
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
      );

      await newReview.save();
      await candy.save();

      const result = category['category_image_url'];
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
      const review = await Review.findOne({ candy_id: detailCompletedCandies_dto.candy_id });
      if (!review) {
        return { message: 'Review not found' };
      }
      const feeling = await Feeling.findById(review['feeling']);

      if (candy.user_id.toString() !== detailCompletedCandies_dto.user_id.toString()) {
        return { message: 'User not Authorized' };
      }

      const result = await {
        year: candy['reward_completed_at'].getFullYear(),
        month: candy['reward_completed_at'].getMonth() + 1,
        date: candy['reward_completed_at'].getDate(),
        category_name: category['name'],
        candy_name: candy['name'],
        feeling_image_url: feeling['feeling_image_url'],
        candy_image_url: candy['candy_image_url'],
        detail_info: candy['detail_info'],
        message: candy['message'],
        candy_history: review['message'],
        review_id: review['_id'],
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
      const { user_id, candy_id, year, month, date, candy_name, category_id, message } = modifyCandy_dto;

      const candy = await Candy.findById(candy_id);

      if (!candy) {
        return { message: 'candy not found' };
      }
      if (candy.user_id.toString() !== user_id.toString()) {
        return { error: 'User not Authorized' };
      }

      candy['reward_planned_at'] = new Date(Date.UTC(year, month - 1, date, 0, 0, 0));
      candy['name'] = candy_name;
      candy['category_id'] = category_id;
      candy['message'] = message;

      await candy.save();
      const result = await '담은 캔디 수정이 완료되었습니다.';
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
      const CONTENT = 'content';

      const { data } = await axios(url);
      const $ = cheerio.load(data);
      return {
        title: $(META_TITLE).attr(CONTENT) || $(DEFAULT_TITLE).text() || '',
        url: $(META_URL).attr(CONTENT) || '',
        image: $(META_IMAGE).attr(CONTENT) || '/assets/images/defaultThumbnail.svg',
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

      let result = '캔디 이미지가 수정되었습니다.';

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
      console.log(err);
      return {
        message: 'Server Error',
      };
    }
  }
}
