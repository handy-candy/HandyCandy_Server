import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CandiesService } from '../services';
import { comingCandyDto } from '../dto/candies.dto';

export const comingCandy = async (req: Request, res: Response) => {
  const commingCandy_dto: comingCandyDto = {
    user_id: req.body.user.id,
  };

  const result = await CandiesService.comingCandy(commingCandy_dto);

  res.status(200).json({ result: result });
};
