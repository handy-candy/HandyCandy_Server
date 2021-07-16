import mongoose from 'mongoose';
import { IReview } from '../interfaces/IReview';

const ReviewSchema = new mongoose.Schema({
  feeling: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Feeling',
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
