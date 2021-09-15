import mongoose from 'mongoose';

export interface ICandy {
  name: string;
  shopping_link?: string;
  candy_image_url?: string;
  reward_planned_at?: Date;
  message?: string;
  reward_completed_at?: Date;
  user_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  created_at?: Date;
  detail_info?: string;
}
