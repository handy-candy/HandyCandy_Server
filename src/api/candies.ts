import { Router, Request, Response } from 'express';
import Candy from '../models/Candy';
import auth from '../middleware/auth';

const router = Router();

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

module.exports = router;
