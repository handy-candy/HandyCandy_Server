import mongoose from 'mongoose';

export interface ICategory {
  name: string;
  category_image_url: string;
  banner: string;
  user_id: mongoose.Types.ObjectId;
}
