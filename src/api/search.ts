import { Router, Request, Response } from 'express';
import Candy from '../models/Candy';
import auth from '../middleware/auth';

const router = Router();

router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const date = new Date();
    const today = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    const completed_candies = await Candy.find({
      name: new RegExp(req.query.item),
      user_id: req.body.user.id,
      reward_completed_at: {
        $lte: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)),
        $gt: new Date(Date.UTC(1111, 11, 0, 0, 0, 0)),
      },
    }).populate('category_id', { category_image_url: 1, name: 1, _id: 0 });

    const coming_candies = await Candy.find({
      name: new RegExp(req.query.item),
      user_id: req.body.user.id,
      reward_completed_at: {
        $lte: new Date(Date.UTC(1111, 11, 0, 0, 0, 0)),
      },
    }).populate('category_id', { category_image_url: 1, name: 1, _id: 0 });

    let coming_array = [];
    for (const candy of coming_candies) {
      const created_date = candy['created_at'];
      let data = {
        candy_image_url: candy['candy_image_url'],
        waiting_date: Math.floor(Math.abs(today.getTime() - created_date.getTime()) / (1000 * 3600 * 24)),
        category_image_url: candy['category_id']['category_image_url'],
        category_name: candy['category_id']['name'],
        candy_name: candy['name'],
      };
      coming_array.push(data);
    }
    const completed_array = [];

    for (const candy of completed_candies) {
      const created_date = candy['created_at'];
      let data = {
        candy_image_url: candy['candy_image_url'],
        year: candy['reward_completed_at'].getFullYear(),
        month: candy['reward_completed_at'].getMonth() + 1,
        date: candy['reward_completed_at'].getDate(),
        category_image_url: candy['category_id']['category_image_url'],
        category_name: candy['category_id']['name'],
        candy_name: candy['name'],
      };
      completed_array.push(data);
    }
    const result = await {
      search_item: req.query.item,
      coming_candy_count: coming_array.length,
      coming_list: coming_array,
      completed_candy_count: completed_array.length,
      completed_list: completed_array,
    };
    res.json({
      status: 200,
      success: true,
      result: result,
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
