import { Router } from 'express';
import { check } from 'express-validator';
import {
  comingCandy,
  deleteCandy,
  recommendCandy,
  addCandy,
  addDateCandy,
  completedCandy,
  detailCompletedCandies,
  modifyCandy,
  modifyImage,
  getAllCandies,
} from '../controllers';
import auth from '../middleware/auth';
import upload from '../middleware/upload';
const router = Router();

router.get('/commingCandy', auth, comingCandy);

router.delete('/:candy_id', auth, deleteCandy);

router.get('/recommendCandy', recommendCandy);

router.post('/', auth, addCandy);

router.put('/date/:candy_id', auth, addDateCandy);

router.get('/completedCandy', auth, completedCandy);

router.get('/completedCandy/detail/:candy_id', auth, detailCompletedCandies);

router.put('/:candy_id', auth, modifyCandy);

router.patch('/image/:candy_id', upload.single('candy_image_url'), auth, modifyImage);

router.get('/all', auth, getAllCandies);

module.exports = router;
