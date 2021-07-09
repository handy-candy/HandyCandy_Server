import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Candy from '../models/Candy';
import Review from '../models/Review';
import Category from '../models/Category';
import auth from '../middleware/auth';

const router = Router();

router.get('/review/:candy_id', auth, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const candy = await Candy.findById(req.params.candy_id);
    if (!candy) {
      return res.status(404).json({ error: 'Candy not found' });
    }
    if (candy.user_id.toString() !== req.body.user.id) {
      return res.status(401).json({ error: 'User not Authorized' });
    }
    const category = await Category.findById(candy['category_id']);
    const result = await {
      category_name: category['name'],
      candy_name: candy['name'],
      detail_info: candy['detail_info'],
      shopping_link: candy['shopping_link'],
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      date: today.getDate(),
    };

    res.json({
      status: 200,
      success: true,
      result: result,
    });
  } catch (err) {
    res.status(500).send({ error: 'Server Error' });
  }
});

router.post(
  '/review',
  auth,
  [check('feeling', 'FeelingID is required').not().isEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const today = new Date();
      const candy = await Candy.findById(req.body.candy_id);
      const category = await Category.findById(candy['category_id']);

      const newReview = new Review({
        feeling: req.body.feeling,
        message: req.body.message,
        candy_id: req.body.candy_id,
        category_id: category['_id'],
      });

      candy['reward_completed_at'] = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

      await newReview.save();
      await candy.save();

      res.json({
        status: 200,
        success: true,
        result: {
          category_image_url: category['category_image_url'],
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: 'Server Error' });
    }
  },
);

module.exports = router;
