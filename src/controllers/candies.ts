import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CandiesService } from '../services';
import {
  candyDto,
  addDateCandyDto,
  newCandyDto,
  userDto,
  completedCandyDto,
  modifyCompletedCandyDto,
  reviewDto,
  addCandyCategoryDto,
  modifyCandyDto,
  moidfyImageDto,
} from '../dto/candies.dto';

export const comingCandy = async (req: Request, res: Response) => {
  const comingCandy_dto: userDto = {
    user_id: req.body.user.id,
  };

  const result = await CandiesService.comingCandy(comingCandy_dto);

  res.status(200).json({ result: result });
};

export const deleteCandy = async (req: Request, res: Response) => {
  const deleteCandy_dto: candyDto = {
    user_id: req.body.user.id,
    candy_id: req.params.candy_id,
  };

  const result = await CandiesService.deleteCandy(deleteCandy_dto);

  res.status(200).json({ result: result });
};

export const recommendCandy = async (req: Request, res: Response) => {
  const result = await CandiesService.recommendCandy();

  res.status(200).json({ result: result });
};

export const addCandy = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const candy_dto: newCandyDto = {
    user_id: req.body.user.id,
    shopping_link: req.body.shopping_link,
  };
  const result = await CandiesService.addCandy(candy_dto);

  res.status(200).json({ result: result });
};

export const addDateCandy = async (req: Request, res: Response) => {
  const addDateCandy_dto: addDateCandyDto = {
    user_id: req.body.user.id,
    candy_id: req.params.candy_id,
    year: req.body.year,
    month: req.body.month,
    date: req.body.date,
  };
  const result = await CandiesService.addDateCandy(addDateCandy_dto);

  res.status(200).json({ result: result });
};

export const completedCandy = async (req: Request, res: Response) => {
  const completedCandy_dto: completedCandyDto = {
    user_id: req.body.user.id,
  };

  const result = await CandiesService.completedCandy(completedCandy_dto);

  res.status(200).json({ result: result });
};

export const detailCompletedCandies = async (req: Request, res: Response) => {
  const detailCompletedCandy_dto: candyDto = {
    user_id: req.body.user.id,
    candy_id: req.params.candy_id,
  };

  const result = await CandiesService.detailCompletedCandies(detailCompletedCandy_dto);

  res.status(200).json({ result: result });
};

export const modifyCandy = async (req: Request, res: Response) => {
  const modifyCandy_dto: modifyCandyDto = {
    user_id: req.body.user.id,
    candy_id: req.params.candy_id,
    candy_name: req.body.candy_name,
    price: req.body.price,
  };

  const result = await CandiesService.modifyCandy(modifyCandy_dto);
  res.status(200).json({ result: result });
};

export const modifyImage = async (req: Request, res: Response) => {
  const modifyImage_dto: moidfyImageDto = {
    user_id: req.body.user.id,
    candy_id: req.params.candy_id,
    candy_image_url: req.file.location,
  };

  const result = await CandiesService.modifyImage(modifyImage_dto);

  res.status(200).json({ result: result });
};

export const getAllCandies = async (req: Request, res: Response) => {
  const completedCandy_dto: completedCandyDto = {
    user_id: req.body.user.id,
  };

  const result = await CandiesService.getAllCandies(completedCandy_dto);

  res.status(200).json({ result: result });
};

export const addCandyCategory = async (req: Request, res: Response) => {
  const candy_dto: addCandyCategoryDto = {
    user_id: req.body.user.id,
    candy_id: req.params.candy_id,
    category_name: req.body.category_name,
    category_image_url: req.body.category_image_url,
  };

  const result = await CandiesService.addCandyCategory(candy_dto);

  res.status(200).json({ result: result });
};
