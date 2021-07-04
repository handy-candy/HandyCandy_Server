import mongoose from "mongoose";
import { IReview } from "../interfaces/IReview";

const ReviewSchema = new mongoose.Schema({
  
  id: {
    type: Number,
    required: true,
  },
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
    type: Number,
    ref: "Candy",
    required: true,
  },
  category_id: {
    type: Number,
    ref: "Category",
    required: true,
  }, 

});

export default mongoose.model<IReview & mongoose.Document>("Review", ReviewSchema);
