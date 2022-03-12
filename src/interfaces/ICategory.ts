import mongoose from 'mongoose';

export interface ICategory {
  name: string;
  category_image_url: string;
  user_id: mongoose.Types.ObjectId;
}
