import mongoose from 'mongoose';

export interface mailDto {
    user_id: mongoose.Types.ObjectId;
    candy_id: mongoose.Types.ObjectId;
    title: string;
    content: string;
    send_date: Date;
    is_sent: boolean;
  }
  