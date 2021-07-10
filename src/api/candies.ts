import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import Candy from '../models/Candy';

const router = Router();

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
