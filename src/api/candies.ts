import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import {
  comingCandy,
  waitingCandy,
  deleteCandy,
  recommendCandy,
  addCandy,
  addDateCandy,
  completedCandy,
  modifyCompletedCandy,
  reviewCandy,
  addReview,
  detailCompletedCandies,
} from '../controllers';
import Candy from '../models/Candy';
import User from '../models/User';
import Review from '../models/Review';
import Feeling from '../models/Feeling';
import Category from '../models/Category';
import auth from '../middleware/auth';
const router = Router();

const check_candy = [
  check('category_id', 'CategoryID is required').not().isEmpty(),
  check('candy_name', 'CandyName is required').not().isEmpty(),
];

const check_feeling = [check('feeling', 'FeelingID is required').not().isEmpty()];

router.get('/commingCandy', auth, comingCandy);

router.get('/waitingCandy', auth, waitingCandy);

router.delete('/:candy_id', auth, deleteCandy);

router.get('/recommendCandy', auth, recommendCandy);

router.post('/', auth, check_candy, addCandy);

router.put('/date/:candy_id', auth, addDateCandy);

router.get('/completedCandy/:month', auth, completedCandy);

router.put('/completedCandy', auth, modifyCompletedCandy);

router.get('/review/:candy_id', auth, reviewCandy);

router.post('/review', auth, check_feeling, addReview);

router.get('/completedCandy/detail/:candy_id', auth, detailCompletedCandies);

router.put('/:candy_id', auth, async (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const { year, month, date, candy_name, category_id, message } = req.body;

    const candy = await Candy.findById(req.params.candy_id);

    if (!candy) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (candy.user_id.toString() !== req.body.user.id) {
      return res.status(401).json({ error: 'User not Authorized' });
    }

    candy['reward_planned_at'] = new Date(Date.UTC(year, month - 1, date, 0, 0, 0));
    candy['candy_name'] = candy_name;
    candy['category_id'] = category_id;
    candy['message'] = message;

    await candy.save();

    res.json({
      status: 200,
      success: true,
      result: '담은 캔디 수정이 완료되었습니다.',
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/image/:candy_id', auth, async (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const candy = await Candy.findById(req.params.candy_id);

    if (!candy) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (candy.user_id.toString() !== req.body.user.id) {
      return res.status(401).json({ error: 'User not Authorized' });
    }

    candy['candy_image_url'] = req.body.candy_image_url;

    await candy.save();

    res.json({
      status: 200,
      success: true,
      result: '캔디 이미지가 수정되었습니다.',
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
