import mongoose from 'mongoose';
import { ICategory } from '../interfaces/ICategory';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category_image_url: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<ICategory & mongoose.Document>('Category', CategorySchema);
