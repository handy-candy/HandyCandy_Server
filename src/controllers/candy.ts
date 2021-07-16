import { Request, Response } from 'express';
import { candyDto } from '../dto/candies.dto';
import { CandyService } from '../services/CandyService';

export const candyDetail = async (req: Request, res: Response) => {
    const candyDetail_dto: candyDto = {
        user_id: req.body.user.id,
        candy_id: req.params.id,
      };
    
      const result = await CandyService.candyDetail(candyDetail_dto);
    
      res.status(200).json({ result: result });
};