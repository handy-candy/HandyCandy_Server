/**
 * @swagger
 *  components:
 *    schemas:
 *      Candy:
 *        type: object
 *        required:
 *          - name
 *          - user_id
 *          - category_id
 *        properties:
 *          name:
 *            type: String
 *          shopping_link:
 *            type: String
 *          shopping_link_image:
 *            type: String
 *          shopping_link_name:
 *            type: String
 *          price:
 *            type: String
 *          candy_image_url:
 *            type: String
 *          notice_agreement:
 *            type: Boolean
 *          reward_planned_at:
 *            type: Date
 *          reward_completed_at:
 *            type: Date
 *          user_id:
 *            type: mongoose.Schema.Types.ObjectId
 *            ref: 'User'
 *          category_id:
 *            type: mongoose.Schema.Types.ObjectId
 *            ref: 'User'
 */

import mongoose from 'mongoose';
import { ICandy } from '../interfaces/ICandy';

const CandySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  shopping_link: {
    type: String,
  },
  shopping_link_image: {
    type: String,
  },
  shopping_link_name: {
    type: String,
  },
  price: {
    type: String,
  },
  candy_image_url: {
    type: String,
  },
  reward_planned_at: {
    type: Date,
  },
  reward_completed_at: {
    type: Date,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

export default mongoose.model<ICandy & mongoose.Document>('Candy', CandySchema);
