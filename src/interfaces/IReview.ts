import mongoose from "mongoose";

export interface IReview {
 
  id: number;
  feeling: number;
  review_image_url: string;
  message: string;
  candy_id: number;
  category_id: number;

}
