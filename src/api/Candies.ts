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
module.exports = router;