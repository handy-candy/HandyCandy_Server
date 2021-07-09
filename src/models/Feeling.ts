import mongoose from 'mongoose';
import { IFeeling } from '../interfaces/IFeeling';

const FeelingSchema = new mongoose.Schema({
  feeling_image_url: {
    type: String,
    require: true,
  },
});

export default mongoose.model<IFeeling & mongoose.Document>('Feeling', FeelingSchema);
