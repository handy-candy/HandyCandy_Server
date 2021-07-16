import { Router } from 'express';
import { check } from 'express-validator'
import { 
  allCategory, 
  deleteCategory,
  addCategory,  
  modifyCategory,
  detailCategory 
} from '../controllers/category';
import auth from '../middleware/auth';
const router = Router();
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

const check_category = [
    check('name', 'Category name is required').not().isEmpty(),
    check('category_image_url', 'category emoji is required').not().isEmpty(),
];

router.get('/', auth, allCategory);

router.delete('/:id', auth, deleteCategory);

router.post('/', auth, check_category, addCategory);

router.put('/:id', auth, modifyCategory);

router.get('/detail/:id', auth, detailCategory);

module.exports = router;
