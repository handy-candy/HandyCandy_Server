import mongoose from 'mongoose';

export interface userDto {
  user_id: mongoose.Types.ObjectId;
}

export interface candyDto {
  candy_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
}

export interface newCandyDto {
  user_id: mongoose.Types.ObjectId;
  shopping_link: string;
}

export interface addDateCandyDto {
  user_id: mongoose.Types.ObjectId;
  candy_id: mongoose.Types.ObjectId;
  year: number;
  month: number;
  date: number;
}

export interface completedCandyDto {
  user_id: mongoose.Types.ObjectId;
}

export interface modifyCompletedCandyDto {
  user_id: mongoose.Types.ObjectId;
  review_id: mongoose.Types.ObjectId;
  candy_name: string;
  feeling: mongoose.Types.ObjectId;
  message: string;
}

export interface reviewDto {
  user_id: mongoose.Types.ObjectId;
  candy_id: mongoose.Types.ObjectId;
  feeling: mongoose.Types.ObjectId;
  message: string;
}

export interface modifyCandyDto {
  user_id: mongoose.Types.ObjectId;
  candy_id: mongoose.Types.ObjectId;
  candy_name: string;
  price: number;
}

export interface moidfyImageDto {
  user_id: mongoose.Types.ObjectId;
  candy_id: mongoose.Types.ObjectId;
  candy_image_url: string;
}

export interface addCandyCategoryDto {
  user_id: mongoose.Types.ObjectId;
  candy_id: mongoose.Types.ObjectId;
  category_name: string;
  category_image_url: string;
}
