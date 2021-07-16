import { Request, Response } from 'express';
import { SearchService } from '../services';
import { searchDto } from '../dto/search.dto';

export const searchCandy = async (req: Request, res: Response) => {
  const searchCandy_dto: searchDto = {
    user_id: req.body.user.id,
    item: req.query.item,
  };

  const result = await SearchService.searchCandy(searchCandy_dto);

  res.status(200).json({ result: result });
};
