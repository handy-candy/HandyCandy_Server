import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Candy from '../models/Candy';
import User from '../models/User';

const router = Router();

/**
 * @route GET /userInfo
 * @desc Get user info by user ID
 */

router.get('/', async (req: Request, res: Response) => {
  try {
    const candies = await Candy.find({ user_id: req.headers.user_id });
    const user_nickname = await User.findById(req.headers.user_id).select({ nickname: 1, _id: 0 });
    const candyCount = candies.length;
    const date = new Date();
    const month = date.getMonth() + 1;

    var banner, candy_count_phrase, phrase;

    if (candyCount == 0) {
      phrase = user_nickname['nickname'] + '님만의 캔디처럼 달콤한 보상을 담아보세요';
      candy_count_phrase = '';
      banner = '비어있는 병을 채워주세요!';
    } else if (candyCount % 10 == 0) {
      candy_count_phrase = '벌써 ' + candyCount + '개!';
      banner = '풍부했던 날을 보내셨네요';
    } else {
      candy_count_phrase = candyCount + '개의 캔디!';
      banner = '행복을 더 담아보세요';
    }

    res.json({
      status: 200,
      success: true,
      result: {
        user_nickname: user_nickname['nickname'],
        candy_count_phrase: candy_count_phrase,
        month: month,
        phrase: '',
        banner: banner,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
