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

export const waitingCandy = async (req: Request, res: Response) => {
  const waitingCandy_dto: userDto = {
    user_id: req.body.user.id,
  };
  const result = await CandiesService.waitingCandy(waitingCandy_dto);

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
    category_id: req.body.category_id,
    candy_name: req.body.candy_name,
    shopping_link: req.body.shopping_link,
    detail_info: req.body.detail_info,
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
    message: req.body.message,
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

export const modifyCompletedCandy = async (req: Request, res: Response) => {
  const modifyCompletedCandy_dto: modifyCompletedCandyDto = {
    user_id: req.body.user.id,
    review_id: req.body.review_id,
    candy_name: req.body.candy_name,
    feeling: req.body.feeling,
    message: req.body.message,
  };

  const result = await CandiesService.modifyCompletedCandy(modifyCompletedCandy_dto);

  res.status(200).json({ result: result });
};

export const reviewCandy = async (req: Request, res: Response) => {
  const reviewCandy_dto: candyDto = {
    user_id: req.body.user.id,
    candy_id: req.params.candy_id,
  };

  const result = await CandiesService.reviewCandy(reviewCandy_dto);

  res.status(200).json({ result: result });
};

export const addReview = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const review_dto: reviewDto = {
    user_id: req.body.user.id,
    candy_id: req.body.candy_id,
    feeling: req.body.feeling,
    message: req.body.message,
  };

  const result = await CandiesService.addReview(review_dto);

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
    year: req.body.year,
    month: req.body.month,
    date: req.body.date,
    candy_name: req.body.candy_name,
    category_id: req.body.category_id,
    message: req.body.message,
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
