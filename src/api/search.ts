import { Router, Request, Response } from 'express';
import Candy from '../models/Candy';
import auth from '../middleware/auth';

const router = Router();

router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const date = new Date();
    const today = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    const candies = await Candy.find({
      name: new RegExp(req.query.item),
      user_id: req.body.user.id,
    }).populate('category_id', { category_image_url: 1, name: 1, _id: 0 });

    let candy_array = [];
    for (const candy of candies) {
      const created_date = candy['created_at'];
      let data = {
        candy_image_url: candy['candy_image_url'],
        waiting_date: Math.floor(Math.abs(today.getTime() - created_date.getTime()) / (1000 * 3600 * 24)),
        category_image_url: candy['category_id']['category_image_url'],
        category_name: candy['category_id']['name'],
        candy_name: candy['name'],
      };
      candy_array.push(data);
    }
    const result = await {
      search_item: req.query.item,
      count: candies.length,
      item_list: candy_array,
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
