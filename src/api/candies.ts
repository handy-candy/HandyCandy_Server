import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Candy from '../models/Candy';
import Review from '../models/Review';
import Category from '../models/Category';
import auth from '../middleware/auth';
import Feeling from '../models/Feeling';

const router = Router();

router.get('/completedCandy/detail/:candy_id', auth, async (req: Request, res: Response) => {
  try {
    const candy = await Candy.findById(req.params.candy_id);
    const category = await Category.findById(candy['category_id']);
    const review = await Review.findOne({ candy_id: req.params.candy_id });
    const feeling = await Feeling.findById(review['feeling']);

    if (!candy) {
      return res.status(404).json({ error: 'Candy not found' });
    }
    if (candy.user_id.toString() !== req.body.user.id) {
      return res.status(401).json({ error: 'User not Authorized' });
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

    res.json({
      status: 200,
      success: true,
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Server Error' });
  }
});

module.exports = router;
