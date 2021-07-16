import mongoose from 'mongoose';

export interface searchDto {
  user_id: mongoose.Types.ObjectId;
  item: string;
}
