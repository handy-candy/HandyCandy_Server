import { Router, Request, Response } from 'express';
import Candy from '../models/Candy';
import auth from '../middleware/auth';

const router = Router();

router.delete('/:candy_id', auth, async (req: Request, res: Response) => {
  try {
    const candy = await Candy.findById(req.params.candy_id);
    if (!candy) {
      return res.status(404).json('Candy not found');
    }
    if (candy.user_id.toString() !== req.body.user.id) {
      return res.status(401).json({ msg: 'User not Authorized' });
    }

    await candy.remove();

    res.json({
      status: 200,
      success: true,
      result: '캔디가 삭제되었습니다',
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Candy not found' });
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
