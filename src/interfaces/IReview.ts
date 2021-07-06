import mongoose from 'mongoose';

export interface IReview {
  feeling: number;
  review_image_url?: string;
  message?: string;
  candy_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
}
