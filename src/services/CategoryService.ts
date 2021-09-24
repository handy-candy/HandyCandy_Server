import { userDto } from '../dto/candies.dto';
import { categoryDto, newCategoryDto } from '../dto/category.dto';
import Candy from '../models/Candy';
import Category from '../models/Category';

export class CategoryService {
  static async allCategory(user_dto: userDto) {
    try {
      let category_array = await Category.find({ user_id: user_dto.user_id });
      const normal = [
        '60e2fe377056fe1264f76eed',
        '60e301b57056fe1264f76ef1',
        '60e301f07056fe1264f76ef3',
        '60e3020e7056fe1264f76ef4',
        '60eaafcb2a4d6bd0a5b684f3',
      ];
      for (const base of normal) {
        let cg = await Category.findById(base);
        category_array.push(cg);
      }
      let result = [];
      if (category_array) {
        for (const category of category_array) {
          let data = {
            category_id: category['_id'],
            name: category['name'],
            category_image_url: category['category_image_url'],
          };
          const candy_array = await Candy.find({
            category_id: category['_id'],
            user_id: user_dto.user_id,
            reward_completed_at: { $lte: new Date(Date.UTC(1111, 10, 13, 0, 0, 0)) },
          }).sort({
            date: -1,
          });

          let category_candy_count = candy_array.length;
          if (candy_array[0]) {
            let candy_created_at = candy_array[0].created_at;
            let image_url_one = candy_array[0].candy_image_url;
            let image_url_two = '';
            let image_url_three = '';
            if (candy_array[1]) {
              image_url_two = candy_array[1].candy_image_url;
            }
            if (candy_array[2]) {
              image_url_three = candy_array[2].candy_image_url;
            }

            let today = new Date();
            let recent_update_date = Math.ceil((today.getTime() - candy_created_at.getTime()) / (1000 * 3600 * 24));
            data['category_candy_count'] = category_candy_count;
            data['recent_update_date'] = recent_update_date;
            data['image_url_one'] = image_url_one;
            data['image_url_two'] = image_url_two;
            data['image_url_three'] = image_url_three;
            result.push(data);
          } else {
            data['category_candy_count'] = '0';
            data['recent_update_date'] = '0';
            data['image_url'] = '';
            result.push(data);
          }
        }
        return result;
      } else {
        return {
          message: 'Error : 404 Not Found',
        };
      }
    } catch (err) {
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }

  static async deleteCategory(category_dto: categoryDto) {
    try {
      const category = await Category.findById(category_dto.category_id);
      if (!category) {
        return {
          message: 'Category not found',
        };
      }

      const candy_array = await Candy.find({ category_id: category_dto.category_id });
      if (candy_array) {
        for (const candy of candy_array) {
          candy.remove();
        }
      }

      await category.remove();

      const result = '카테고리와 해당 캔디들이 삭제되었습니다.';
      return result;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Category not found' };
      }
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }
  static async addCategory(newCategory_dto: newCategoryDto) {
    try {
      const newCategory = new Category({
        name: newCategory_dto.name,
        user_id: newCategory_dto.user_id,
        category_image_url: newCategory_dto.category_image_url,
      });

      const category = await newCategory.save();

      const result = await {
        cantegory_id: category._id,
        category_name: category.name,
        category_image_url: category.category_image_url,
      };
      return result;
    } catch (err) {
      console.error(err.message);
      return { message: 'Server Error' };
    }
  }

  static async modifyCategory(modifyCategory_dto: newCategoryDto) {
    try {
      const { category_id, name, category_image_url } = modifyCategory_dto;

      const category = await Category.findById(category_id);

      if (!category) {
        return { message: 'Category not found' };
      }
      category['name'] = name;
      category['category_image_url'] = category_image_url;

      await category.save();

      const result = '카테고리가 수정되었습니다.';

      return result;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return { message: 'Category not found' };
      }
      return { message: 'Server Error' };
    }
  }

  static async detailCategory(detailCategory_dto: categoryDto) {
    try {
      const category = await Category.findById(detailCategory_dto.category_id);
      if (!category) {
        return { message: 'Category not found' };
      }
      let banner = get_banner_image_url(category['category_image_url']);
      const today = new Date();
      const coming_candy_array = await Candy.find({
        user_id: detailCategory_dto.user_id,
        category_id: detailCategory_dto.category_id,
        reward_planned_at: { $gte: new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0)) },
        reward_completed_at: { $lte: new Date(Date.UTC(1111, 10, 13, 0, 0, 0)) },
      }).sort({ date: -1 });

      const waiting_candy_array = await Candy.find({
        user_id: detailCategory_dto.user_id,
        category_id: detailCategory_dto.category_id,
        reward_planned_at: { $lte: new Date(Date.UTC(1111, 10, 13, 0, 0, 0)) },
        reward_completed_at: { $lte: new Date(Date.UTC(1111, 10, 13, 0, 0, 0)) },
      }).sort({ date: -1 });

      let result_coming_candy_array = [];
      let result_waiting_candy_array = [];
      for (const candy of coming_candy_array) {
        let data = {
          candy_id: candy['_id'],
          candy_image_url: candy['candy_image_url'],
          candy_name: candy['name'],
          category_name: category['name'],
          reward_planned_at: candy['reward_planned_at'],
        };
        let today = new Date(); // 현재 날짜
        let d_day = Math.floor((candy['reward_planned_at'].getTime() - today.getTime()) / (1000 * 3600 * 24));
        data['d_day'] = d_day;
        result_coming_candy_array.push(data);
      }
      for (const candy of waiting_candy_array) {
        let data = {
          candy_id: candy['_id'],
          candy_image_url: candy['candy_image_url'],
          candy_name: candy['name'],
          category_name: category['name'],
        };
        let today = new Date(); // 현재 날짜
        let waiting_date = Math.floor((today.getTime() - candy['created_at'].getTime()) / (1000 * 3600 * 24));

        data['waiting_date'] = waiting_date;
        result_waiting_candy_array.push(data);
      }
      let coming_candy_count = coming_candy_array.length;
      let waiting_candy_count = waiting_candy_array.length;
      const result = await {
        banner: banner,
        all_candy_count: coming_candy_count + waiting_candy_count,
        coming_candy_count: coming_candy_count,
        waiting_candy_count: waiting_candy_count,
        coming_candy: result_coming_candy_array,
        waiting_candy: result_waiting_candy_array,
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
