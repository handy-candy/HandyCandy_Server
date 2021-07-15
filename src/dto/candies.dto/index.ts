import mongoose from 'mongoose';

export interface userDto {
  user_id: mongoose.Schema.Types.ObjectId;
}

export interface candyDto {
  candy_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
}

export interface newCandyDto {
  user_id: mongoose.Schema.Types.ObjectId;
  category_id: mongoose.Schema.Types.ObjectId;
  candy_name: string;
  shopping_link: string;
  candy_image_url: string;
  detail_info: string;
}

export interface addDateCandyDto {
  user_id: mongoose.Schema.Types.ObjectId;
  candy_id: mongoose.Schema.Types.ObjectId;
  year: number;
  month: number;
  date: number;
  message: string;
}

export interface completedCandyDto {
  user_id: mongoose.Schema.Types.ObjectId;
  month: number;
}

export interface modifyCompletedCandyDto {
  user_id: mongoose.Schema.Types.ObjectId;
  review_id: mongoose.Schema.Types.ObjectId;
  candy_name: string;
  feeling: mongoose.Schema.Types.ObjectId;
  message: string;
}

export interface reviewDto {
  user_id: mongoose.Schema.Types.ObjectId;
  candy_id: mongoose.Schema.Types.ObjectId;
  feeling: mongoose.Schema.Types.ObjectId;
  message: string;
}
