import mongoose from 'mongoose';

export interface userDto {
  user_id: mongoose.Types.ObjectId;
}

export interface categoryDto {
  category_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
}

export interface newCategoryDto {
  user_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  name: string;
  category_image_url: string;
}