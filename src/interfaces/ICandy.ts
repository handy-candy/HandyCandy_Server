import mongoose from 'mongoose';

export interface ICandy {
  name?: string;
  shopping_link?: string;
  shopping_link_image?: string;
  shopping_link_name?: string;
  price?: string;
  candy_image_url?: string;
  reward_planned_at?: Date;
  reward_completed_at?: Date;
  user_id: mongoose.Types.ObjectId;
  category_id?: mongoose.Types.ObjectId;
}
