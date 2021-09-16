import { Router } from 'express';
import { check } from 'express-validator';
import {
  comingCandy,
  waitingCandy,
  deleteCandy,
  recommendCandy,
  addCandy,
  addDateCandy,
  completedCandy,
  modifyCompletedCandy,
  reviewCandy,
  addReview,
  detailCompletedCandies,
  modifyCandy,
  modifyImage,
  getAllCandies,
} from '../controllers';
import auth from '../middleware/auth';
import upload from '../middleware/upload';
const router = Router();

const check_candy = [
  check('category_id', 'CategoryID is required').not().isEmpty(),
  check('candy_name', 'CandyName is required').not().isEmpty(),
];

const check_feeling = [check('feeling', 'FeelingID is required').not().isEmpty()];

router.get('/commingCandy', auth, comingCandy);

router.get('/waitingCandy', auth, waitingCandy);

router.delete('/:candy_id', auth, deleteCandy);

router.get('/recommendCandy', recommendCandy);

router.post('/', auth, check_candy, addCandy);

router.put('/date/:candy_id', auth, addDateCandy);

router.get('/completedCandy', auth, completedCandy);

router.put('/completedCandy', auth, modifyCompletedCandy);

router.get('/review/:candy_id', auth, reviewCandy);

router.post('/review', auth, check_feeling, addReview);

router.get('/completedCandy/detail/:candy_id', auth, detailCompletedCandies);

router.put('/:candy_id', auth, modifyCandy);

router.patch('/image/:candy_id', upload.single('candy_image_url'), auth, modifyImage);

router.get('/all', auth, getAllCandies);

module.exports = router;
