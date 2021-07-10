import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Candy from '../models/Candy';
import User from '../models/User';
import Review from '../models/Review';
import Feeling from '../models/Feeling';
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
    }).sort({ reward_planned_at: 1 });

    let candyArray = [];

    for (const candy of candies) {
      let data = { candy_id: candy['_id'], candy_image_url: candy['candy_image_url'], candy_name: candy['name'] };
      const categoryId = await candy['category_id'];
      const category = await Category.findById(categoryId);
      const plannedDate = candy['reward_planned_at'];
      const dDay = Math.floor(Math.abs(today.getTime() - plannedDate.getTime()) / (1000 * 3600 * 24));

      data['category_image_url'] = category['category_image_url'];
      data['category_name'] = category['name'];
      data['d_day'] = dDay;
      data['month'] = plannedDate.getMonth() + 1;
      data['date'] = plannedDate.getDate();
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

router.delete('/:candy_id', auth, async (req: Request, res: Response) => {
  try {
    const candy = await Candy.findById(req.params.candy_id);
    if (!candy) {
      return res.status(404).json('Candy not found');
    }
    if (candy.user_id.toString() !== req.body.user.id) {
      return res.status(401).json({ error: 'User not Authorized' });
    }

    await candy.remove();

    res.json({
      status: 200,
      success: true,
      result: '캔디가 삭제되었습니다',
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Candy not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.get('/recommendCandy', async (req: Request, res: Response) => {
  //기능개발x 일단 더미로 감
  try {
    res.json({
      status: 200,
      success: true,
      result: [
        { candy_name: '자전거 타고 한강가기', candy_image_url: '', tag_name: '산들바람을 느끼며, 몸을 움직이자!' },
        { candy_name: '베라 쿼터먹기', candy_image_url: '', tag_name: '지나친 달콤함이 약이되기도! ' },
        { candy_name: '집 근처 산책하기', candy_image_url: '', tag_name: '오전을 보다 상쾌하게 시작해보자!' },
      ],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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

router.put('/completedCandy', auth, async (req: Request, res: Response) => {
  try {
    const { review_id, candy_name, feeling, message } = req.body;

    const review = await Review.findById(review_id);
    const candy = await Candy.findById(review['candy_id']);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (candy.user_id.toString() !== req.body.user.id) {
      return res.status(401).json({ error: 'User not Authorized' });
    }
    candy['candy_name'] = candy_name;
    review['feeling'] = feeling;
    review['message'] = message;

    await review.save();
    await candy.save();

    res.json({
      status: 200,
      success: true,
      result: '완료 캔디가 수정되었습니다.',
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Candy not found' });
    }
    res.status(500).send({ error: 'Server Error' });
  }
});

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

router.put('/:candy_id', auth, async (req: Request, res: Response) => {
  try {
    const { year, month, date, candy_name, category_id, message } = req.body;

    const candy = await Candy.findById(req.params.candy_id);

    if (!candy) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (candy.user_id.toString() !== req.body.user.id) {
      return res.status(401).json({ error: 'User not Authorized' });
    }

    candy['reward_planned_at'] = new Date(Date.UTC(year, month - 1, date));
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
