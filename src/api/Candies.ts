import { Router, Request, Response } from 'express';
import Candy from '../models/Candy';
import Category from '../models/Category';
import auth from '../middleware/auth';

const router = Router();

router.get('/waitingCandy', auth, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const candies = await Candy.find({
      user_id: req.body.user.id,
      reward_planned_at: { $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
      reward_completed_at: { $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
    })
      .sort({ created_at: 1 })
      .limit(4);

    let candyArray = [];

    for (const candy of candies) {
      let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'] };
      const categoryId = await candy['category_id'];
      const category = await Category.findById(categoryId);
      const createdDate = candy['created_at'];
      const now = new Date();
      const dDay = Math.floor(Math.abs(now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));

      data['category_image_url'] = category['category_image_url'];
      data['waiting_date'] = dDay;
      candyArray.push(data);
    }

    const result = await {
      waiting_candy_count: candyArray.length,
      waiting_candy: candyArray,
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
