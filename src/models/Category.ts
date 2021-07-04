import mongoose from "mongoose";
import { ICategory } from "../interfaces/ICategory";

const CategorySchema = new mongoose.Schema({
  
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  category_image_url: {
    type: String,
    required: true,
  }, 
  
});

export default mongoose.model<ICategory & mongoose.Document>("Category", CategorySchema);
