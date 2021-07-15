import { comingCandyDto } from '../dto/candies.dto';
import Candy from '../models/Candy';
import Category from '../models/Category';

export class CandiesService {
  static async comingCandy(candy_dto: comingCandyDto) {
    try {
      const today = new Date(Date.UTC(2021, 6, 17, 0, 0, 0));
      const candies = await Candy.find({
        user_id: candy_dto.user_id,
        reward_planned_at: { $gte: new Date(Date.UTC(today.getFullYear(), today.getMonth(), 0, 0, 0)) },
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
}
