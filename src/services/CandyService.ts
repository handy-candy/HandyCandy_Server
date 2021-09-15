import { candyDto } from '../dto/candies.dto';
import Candy from '../models/Candy';
import Category from '../models/Category';

export class CandyService {
  static async candyDetail(candyDetail_dto: candyDto) {
    try {
      const candy = await Candy.findById(candyDetail_dto.candy_id);
      if (!candy) {
        return {
          message: 'Candy not found',
        };
      }
      const today = new Date();
      let data = {
        candy_id: candy['_id'],
        candy_image_url: candy['candy_image_url'],
        candy_name: candy['name'],
        shopping_link: candy['shopping_link'],
        reward_planned_at: candy['reward_planned_at'],
        message: candy['message'],
      };
      let d_day = Math.ceil((candy['reward_planned_at'].getTime() - today.getTime()) / (1000 * 3600 * 24));
      let category_id = (await Candy.findById(candyDetail_dto.candy_id)).category_id;
      let category_name = (await Category.findById(category_id)).name;
      let category_image_url = (await Category.findById(category_id)).category_image_url;
      let banner = get_banner_image_url(category_image_url);

      const result = await {
        banner: banner,
        candy_information: data,
        category_name: category_name,
        d_day: d_day,
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

let get_banner_image_url = function (var1) {
  if (var1 == 'Ball') {
    return 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/bboddo.png';
  } else if (var1 == 'Clover') {
    return 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/flower.png';
  } else if (var1 == 'Donut') {
    return 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/donut.png';
  } else if (var1 == 'Double') {
    return 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/dd.png';
  } else if (var1 == 'Flower') {
    return 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/orange.png';
  } else if (var1 == 'Fork') {
    return 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/3d.png';
  } else if (var1 == 'Leaf') {
    return 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/leaf.png';
  } else if (var1 == 'Magnet') {
    return 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/u.png';
  } else if (var1 == 'WaterDrop') {
    return 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/mint.png';
  } else if (var1 == 'X') {
    return 'https://sopt-join-seminar.s3.ap-northeast-2.amazonaws.com/banner/blue.png';
  } else {
    return '';
  }
};
