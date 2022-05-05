import { userDto } from '../dto/candies.dto';
import { categoryDto, newCategoryDto } from '../dto/category.dto';
import Candy from '../models/Candy';
import Category from '../models/Category';

export class CategoryService {
  static async allCategory(user_dto: userDto) {
    try {
      const candyList = await Candy.find({ user_id: user_dto.user_id })
        .populate('category_id', { category_image_url: 1, _id: 0, name: 1 })
        .sort({ reward_planned_at: 1 });
      const today = new Date();
      const result = candyList.map((item) => {
        const planned_date = item.reward_planned_at;
        let d_day = 1111;
        let category_image_url = '';
        let category_name = '';

        if (planned_date.getFullYear() != 1111) {
          d_day = Math.floor((today.getTime() - planned_date.getTime()) / (1000 * 3600 * 24));
        }

        if (item.category_id != null) {
          category_image_url = item.category_id['category_image_url'];
          category_name = item.category_id['name'];
        }

        return {
          candy_id: item._id,
          candy_image_url: item.candy_image_url,
          candy_name: item.name,
          category_image_url: category_image_url,
          d_day: d_day,
          category_name: category_name,
          reward_planned_at: item.reward_planned_at,
          shopping_link_image: item.shopping_link_image,
          shopping_link_name: item.shopping_link_name,
          price: item.price,
        };
      });

      return result;
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

      const coming_candy_array = await Candy.find({
        user_id: detailCategory_dto.user_id,
        category_id: detailCategory_dto.category_id,
        reward_completed_at: { $lte: new Date(Date.UTC(1111, 11, 13, 0, 0, 0)) },
      }).sort({ date: -1 });

      const today = new Date(); // 현재 날짜

      const candy_array = await {
        candy_array: coming_candy_array.map((v) => {
          if (v.reward_planned_at.getFullYear() != 1111) {
            //보상날짜 등록
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
              reward_planned_at: v.reward_planned_at,
              category_name: v.category_id['name'],
              shopping_link_name: v.shopping_link_name,
              shopping_link_image: v.shopping_link_image,
              price: v.price,
            };
          } else {
            return {
              candy_id: v._id,
              candy_image_url: v.candy_image_url,
              candy_name: v.name,
              category_image_url: v.category_id['category_image_url'],
              reward_planned_at: v.reward_planned_at,
              category_name: v.category_id['name'],
              shopping_link_name: v.shopping_link_name,
              shopping_link_image: v.shopping_link_image,
              price: v.price,
            };
          }
        }),
      };

      return candy_array;
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
