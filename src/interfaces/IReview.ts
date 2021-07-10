import mongoose from 'mongoose';

export interface IReview {
  feeling: mongoose.Types.ObjectId;
  message?: string;
  candy_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
}
