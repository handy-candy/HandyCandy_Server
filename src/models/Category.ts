/**
 * @swagger
 *  components:
 *    schemas:
 *      Category:
 *        type: object
 *        required:
 *          - name
 *          - category_image_url
 *          - user_id
 *        properties:
 *          name:
 *            type: String
 *          category_image_url:
 *            type: String
 *          user_id:
 *            type: mongoose.Schema.Types.ObjectId
 *            ref: 'User'
 */

import mongoose from 'mongoose';
import { ICategory } from '../interfaces/ICategory';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category_image_url: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<ICategory & mongoose.Document>('Category', CategorySchema);
