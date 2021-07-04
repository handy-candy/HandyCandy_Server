import mongoose from 'mongoose';
import { ICandy } from '../interfaces/ICandy';

const CandySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  shopping_link: {
    type: String,
    required: true,
  },
  candy_image_url: {
    type: String,
    required: true,
  },
  reward_planned_at: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  reward_completed_at: {
    type: Date,
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true,
  },
  category_id: {
    type: Number,
    ref: 'Category',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICandy & mongoose.Document>('Candy', CandySchema);
