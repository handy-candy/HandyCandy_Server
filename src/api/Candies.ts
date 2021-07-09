import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Candy from '../models/Candy';
import Category from '../models/Category';
import auth from '../middleware/auth';

const router = Router();

router.post(
  '/',
  auth,
  [
    check('category_id', 'CategoryID is required').not().isEmpty(),
    check('candy_name', 'CandyName is required').not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const now = new Date();
      const newCandy = new Candy({
        name: req.body.candy_name,
        shopping_link: req.body.shopping_link,
        user_id: req.body.user.id,
        category_id: req.body.category_id,
        reward_planned_at: new Date(1111, 10, 11),
        created_at: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())),
        message: '',
        candy_image_url: req.body.candy_image_url,
      });

      const candy = await newCandy.save();

      const category = await Category.findById(req.body.category_id);

      res.json({
        status: 200,
        success: true,
        result: {
          candy_id: candy._id,
          category_name: category.name,
          candy_name: candy.name,
          category_image_url: category.category_image_url,
        },
      });
    } catch (err) {
      res.status(500).send({ error: 'Server Error' });
    }
  },
);

router.put('/date/:candy_id', auth, async (req: Request, res: Response) => {
  try {
    const candy = await Candy.findById(req.params.candy_id);

    if (!candy) {
      return res.status(404).json({ error: 'Candy not found' });
    }
    if (candy.user_id.toString() !== req.body.user.id) {
      return res.status(401).json({ error: 'User not Authorized' });
    }

    const plannedDate = new Date(Date.UTC(req.body.year, req.body.month - 1, req.body.date));
    candy['reward_planned_at'] = plannedDate;
    candy['message'] = req.body.message;

    await candy.save();

    res.json({
      status: 200,
      success: true,
      result: '보상 날짜가 등록되었습니다.',
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Candy not found' });
    }
    res.status(500).send({ error: 'Server Error' });
  }
});

module.exports = router;
