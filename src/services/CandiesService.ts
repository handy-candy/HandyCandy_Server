import {
  userDto,
  candyDto,
  newCandyDto,
  addDateCandyDto,
  completedCandyDto,
  modifyCompletedCandyDto,
  reviewDto,
} from '../dto/candies.dto';
import Candy from '../models/Candy';
import Category from '../models/Category';
import Review from '../models/Review';
import User from '../models/User';
import Feeling from '../models/Feeling';

export class CandiesService {
  static async comingCandy(user_dto: userDto) {
    try {
      const today = new Date(Date.UTC(2021, 6, 17, 0, 0, 0));
      const candies = await Candy.find({
        user_id: user_dto.user_id,
        reward_planned_at: { $gte: new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0)) },
        reward_completed_at: { $lte: new Date(Date.UTC(1111, 10, 13, 0, 0, 0)) },
      }).sort({ reward_planned_at: 1 });

      let candy_array = [];
      let negative = [];

      for (const candy of candies) {
        let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'] };
        const category_id = await candy['category_id'];
        const category = await Category.findById(category_id);
        const planned_date = candy['reward_planned_at'];
        let d_day;
        if (planned_date.getTime() - today.getTime() < 0) {
          d_day = Math.floor((today.getTime() - planned_date.getTime()) / (1000 * 3600 * 24));
          d_day *= -1;
        } else {
          d_day = Math.floor((planned_date.getTime() - today.getTime()) / (1000 * 3600 * 24));
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
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }

  static async waitingCandy(user_dto: userDto) {
    try {
      const today = new Date(Date.UTC(2021, 6, 17, 0, 0, 0));
      const candies = await Candy.find({
        user_id: user_dto.user_id,
        reward_planned_at: { $lte: new Date(Date.UTC(1111, 10, 13, 0, 0, 0)) },
        reward_completed_at: { $lte: new Date(Date.UTC(1111, 10, 13, 0, 0, 0)) },
      }).sort({ created_at: -1 });

      let candy_array = [];

      for (const candy of candies) {
        let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'] };
        const category_id = await candy['category_id'];
        const category = await Category.findById(category_id);
        const created_date = candy['created_at'];
        const d_day = Math.floor(Math.abs(today.getTime() - created_date.getTime()) / (1000 * 3600 * 24));

        data['category_image_url'] = category['category_image_url'];
        data['waiting_date'] = d_day;
        candy_array.push(data);
      }

      const result = await {
        waiting_candy_count: candy_array.length,
        waiting_candy: candy_array,
      };
      return result;
    } catch (err) {
      console.error(err.message);
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
      if (candy.user_id !== candy_dto.user_id) {
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
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }

  static async recommendCandy(recommendCandy_dto: userDto) {
    try {
      const result = await [
        { candy_name: '자전거 타고 한강가기', candy_image_url: '', tag_name: '산들바람을 느끼며, 몸을 움직이자!' },
        { candy_name: '베라 쿼터먹기', candy_image_url: '', tag_name: '지나친 달콤함이 약이되기도! ' },
        { candy_name: '집 근처 산책하기', candy_image_url: '', tag_name: '오전을 보다 상쾌하게 시작해보자!' },
      ];

      return result;
    } catch (err) {
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }

  static async addCandy(newCandy_dto: newCandyDto) {
    try {
      const now = new Date();
      const newCandy = new Candy({
        name: newCandy_dto.candy_name,
        shopping_link: newCandy_dto.shopping_link,
        user_id: newCandy_dto.user_id,
        category_id: newCandy_dto.category_id,
        reward_planned_at: new Date(Date.UTC(1111, 10, 11, 0, 0, 0)),
        created_at: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)),
        message: '',
        detail_info: newCandy_dto.detail_info,
        reward_completed_at: new Date(Date.UTC(1111, 10, 11, 0, 0, 0)),
        candy_image_url: newCandy_dto.candy_image_url,
      });

      const candy = await newCandy.save();

      const category = await Category.findById(newCandy_dto.category_id);

      const result = await {
        candy_id: candy._id,
        category_name: category.name,
        candy_name: candy.name,
        category_image_url: category.category_image_url,
      };
      return result;
    } catch (err) {
      console.error(err.message);
      return { message: 'Server Error' };
    }
  }

  static async addDateCandy(addDateCandy_dto: addDateCandyDto) {
    try {
      const candy = await Candy.findById(addDateCandy_dto.candy_id);

      if (!candy) {
        return { message: 'Candy not found' };
      }
      if (candy.user_id !== addDateCandy_dto.user_id) {
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
      const today = new Date(Date.UTC(2021, completedCandy_dto.month - 1, 17, 0, 0, 0));
      const user_nickname = await User.findById(completedCandy_dto.user_id).select({ nickname: 1, _id: 0 });
      const candies = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lte: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)),
          $gt: new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0)),
        },
      }).sort({ reward_completed_at: -1 });

      const before_candies = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0)),
        },
      }).populate('category_id', { category_image_url: 1, _id: 0 });

      let end = 9;
      if (before_candies.length <= 9) end = before_candies.length;
      else end = 9;

      const before_categoris = await {
        category_image_url: before_candies.slice(0, end).map((v) => {
          return v.category_id['category_image_url'];
        }),
      };

      const after_candies = await Candy.find({
        user_id: completedCandy_dto.user_id,
        reward_completed_at: {
          $lt: new Date(Date.UTC(today.getFullYear(), today.getMonth() + 2, 1, 0, 0, 0)),
          $gte: new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 1, 0, 0, 0)),
        },
      }).populate('category_id', { category_image_url: 1, _id: 0 });

      if (after_candies.length <= 9) end = after_candies.length;
      else end = 9;
      const after_categoris = await {
        category_image_url: after_candies.slice(0, end).map((v) => {
          return v.category_id['category_image_url'];
        }),
      };

      let candy_array = [];
      let cur_categories = [];
      for (const candy of candies) {
        let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'] };
        let category_id = await candy['category_id'];
        let category = await Category.findById(category_id);

        data['category_image_url'] = category['category_image_url'];
        data['category_name'] = category['name'];
        data['year'] = candy['reward_completed_at'].getFullYear();
        data['month'] = candy['reward_completed_at'].getMonth() + 1;
        data['date'] = candy['reward_completed_at'].getDate();
        if (cur_categories.length < 9) cur_categories.push(category['category_image_url']);
        candy_array.push(data);
      }

      const result = await {
        user_nickname: user_nickname['nickname'],
        month: completedCandy_dto.month,
        candy_count: candies.length,
        cur_categories: cur_categories,
        before_categoris: before_categoris['category_image_url'],
        after_categoris: after_categoris['category_image_url'],
        completed_candy: candy_array,
      };

      return result;
    } catch (err) {
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }

  static async modifyCompletedCandy(modifyCompletedCandy_dto: modifyCompletedCandyDto) {
    try {
      const { review_id, candy_name, feeling, message } = modifyCompletedCandy_dto;

      const review = await Review.findById(review_id);
      const candy = await Candy.findById(review['candy_id']);

      if (!review) {
        return { message: 'Review not found' };
      }
      if (candy.user_id !== modifyCompletedCandy_dto.user_id) {
        return { message: 'User not Authorized' };
      }
      candy['candy_name'] = candy_name;
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
      if (candy.user_id.toString() !== review_dto.user_id.toHexString()) {
        return { error: 'User not Authorized' };
      }
      const category = await Category.findById(candy['category_id']);
      const result = await {
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
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }

  static async addReview(review_dto: reviewDto) {
    try {
      const today = new Date();
      const candy = await Candy.findById(review_dto.candy_id);
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
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }

  static async detailCompletedCandies(detailCompletedCandies_dto: candyDto) {
    try {
      const candy = await Candy.findById(detailCompletedCandies_dto.candy_id);
      const category = await Category.findById(candy['category_id']);
      const review = await Review.findOne({ candy_id: detailCompletedCandies_dto.candy_id });
      const feeling = await Feeling.findById(review['feeling']);

      if (!candy) {
        return { message: 'Candy not found' };
      }
      if (candy.user_id !== detailCompletedCandies_dto.user_id) {
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
      };

      return result;
    } catch (err) {
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }
}
