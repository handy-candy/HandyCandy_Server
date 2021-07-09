import { Router, Request, Response } from 'express';
import Candy from '../models/Candy';
import Review from '../models/Review';
import auth from '../middleware/auth';

const router = Router();

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

module.exports = router;
