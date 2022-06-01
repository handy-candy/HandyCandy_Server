 import mongoose from 'mongoose';
 import { IMail } from '../interfaces/IMail';
 
 const MailSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    candy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candy',
        required: true,
    },
    title: {
     type: String,
     required: true,
   },
   content: {
     type: String,
     required: true,
   },
   send_date: {
     type: Date,
   },
   is_sent: {
     type: Boolean,
   },
   
 });
 
 export default mongoose.model<IMail & mongoose.Document>('Mail', MailSchema);
 