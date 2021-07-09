import { Router, Request, Response } from 'express';
import Candy from '../models/Candy';
import Category from '../models/Category';
import auth from '../middleware/auth';
import User from '../models/User';

const router = Router();

router.get('/completedCandy', auth, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const user_nickname = await User.findById(req.body.user.id).select({ nickname: 1, _id: 0 });
    const candies = await Candy.find({
      user_id: req.body.user.id,
      reward_completed_at: {
        $lte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $gte: new Date(today.getFullYear(), today.getMonth()),
      },
    }).sort({ reward_completed_at: -1 });

    let candyArray = [];

    for (const candy of candies) {
      let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'] };
      const categoryId = await candy['category_id'];
      const category = await Category.findById(categoryId);

      data['category_image_url'] = category['category_image_url'];
      data['category_name'] = category['name'];
      data['year'] = candy['reward_completed_at'].getFullYear();
      data['month'] = candy['reward_completed_at'].getMonth() + 1;
      data['date'] = candy['reward_completed_at'].getDate();
      candyArray.push(data);
    }

    const result = await {
      user_nickname: user_nickname['nickname'],
      month: today.getMonth() + 1,
      candy_count: candies.length,
      completed_candy: candyArray,
    };
    res.json({
      status: 200,
      success: true,
      result: result,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: 'Server Error' });
  }
});

module.exports = router;
