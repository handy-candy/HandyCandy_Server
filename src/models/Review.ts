import mongoose from 'mongoose';
import { IReview } from '../interfaces/IReview';

const ReviewSchema = new mongoose.Schema({
  feeling: {
    type: Number,
    required: true,
  },
  review_image_url: {
    type: String,
  },
  message: {
    type: String,
  },
  candy_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candy',
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

export default mongoose.model<IReview & mongoose.Document>('Review', ReviewSchema);
