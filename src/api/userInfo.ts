import { Router, Request, Response } from 'express';
import Candy from '../models/Candy';
import User from '../models/User';
import auth from '../middleware/auth';

const router = Router();

/**
 * @route GET /userInfo
 * @desc Get user info by user ID
 */

router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const candies = await Candy.find({
      user_id: req.body.user.id,
      reward_completed_at: {
        $gte: new Date(Date.UTC(today.getFullYear(), today.getMonth())),
        $lt: new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1)),
      },
    });

    const user_nickname = await User.findById(req.body.user.id).select({ nickname: 1, _id: 0 });
    const candy_count = candies.length;
    const month = today.getMonth() + 1;
    const date = today.getDate();

    let banner, candy_count_phrase, phrase;

    if (candy_count) {
      const comming_candies = await Candy.find({
        user_id: req.body.user.id,
        reward_planned_at: {
          $gte: new Date(Date.UTC(today.getFullYear(), today.getMonth(), 17, 0, 0, 0, 0)),
          $lt: new Date(Date.UTC(today.getFullYear(), today.getMonth(), 18, 0, 0, 0, 0)),
        },
      });

      if (comming_candies.length) {
        const cnt = comming_candies.length;
        const random = Math.floor(Math.random() * cnt);
        const single = comming_candies[random];

        banner = `오늘은 ${single['name']}을 하는 날이네요!`;
      } else {
        const find_candies = await Candy.find({
          user_id: req.body.user.id,
          reward_planned_at: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
          },
        });
        if (find_candies.length) {
          const cnt = find_candies.length;
          const random = Math.floor(Math.random() * cnt);
          const single = find_candies[random];
          const d_day = Math.floor(
            Math.abs(today.getTime() - single['reward_planned_at'].getTime()) / (1000 * 3600 * 24),
          );
          banner = `오늘로부터 ${d_day}일후면, ${single['name']}을 하는 날이네요!`;
        } else {
          const waiting_candies = await Candy.find({
            user_id: req.body.user.id,
            reward_planned_at: { $lte: new Date(1111, 10, 13) },
            reward_completed_at: { $lte: new Date(1111, 10, 13) },
          });

          if (waiting_candies.length) {
            banner = `기다리는 캔디가 ${waiting_candies.length}개가 있어요!`;
          } else {
            const find_candies = await Candy.find({
              user_id: req.body.user.id,
              reward_planned_at: {
                $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
              },
            });
            if (find_candies.length) {
              const cnt = find_candies.length;
              const random = Math.floor(Math.random() * cnt);
              const single = find_candies[random];
              const d_day = Math.floor(
                Math.abs(today.getTime() - single['reward_planned_at'].getTime()) / (1000 * 3600 * 24),
              );
              banner = `오늘로부터 ${d_day}후면, ${single['name']}을 하는 날이에요!`;
            }
          }
        }
      }
    }

    if (!candy_count) {
      phrase = `${user_nickname['nickname']}님만의 캔디처럼 달콤한 보상을 담아보세요`;
      candy_count_phrase = ``;
      phrase = `비어있는 병을 채워주세요!`;
      banner = `${user_nickname['nickname']}님만의 캔디처럼 달콤한 보상을 담아보세요`;
    } else if (candy_count % 10 == 0) {
      candy_count_phrase = `벌써 ${candy_count}개!`;
      phrase = `풍부했던 날을 보내셨네요`;
    } else {
      candy_count_phrase = `${candy_count}개의 캔디!`;
      phrase = `행복을 더 담아보세요`;
    }

    res.json({
      status: 200,
      success: true,
      result: {
        user_nickname: user_nickname['nickname'],
        candy_count_phrase: candy_count_phrase,
        month: month,
        date: 17,
        phrase: phrase,
        banner: banner,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
