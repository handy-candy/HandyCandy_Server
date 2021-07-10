import { Router, Request, Response } from 'express';
import Candy from '../models/Candy';
import Category from '../models/Category';
import auth from '../middleware/auth';

const router = Router();

/**
 * @route GET api/candies/commingCandy
 * @desc Get commingCandies by user ID
 */

router.get('/commingCandy', auth, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const candies = await Candy.find({
      user_id: req.body.user.id,
      reward_planned_at: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
      reward_completed_at: { $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
    });

    let candyArray = [];

    for (const candy of candies) {
      let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'] };
      const categoryId = await candy['category_id'];
      const category = await Category.findById(categoryId);
      const plannedDate = candy['reward_planned_at'];
      const now = new Date();
      const dDay = plannedDate.getDate() - now.getDate();

      data['category_image_url'] = category['category_image_url'];
      data['category_name'] = category['name'];
      data['d_day'] = dDay;
      candyArray.push(data);
    }

    const result = await {
      comming_candy_count: candyArray.length,
      comming_candy: candyArray,
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
