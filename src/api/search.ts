import { Router } from 'express';
import auth from '../middleware/auth';
import { searchCandy } from '../controllers';
const router = Router();

router.get('/', auth, searchCandy);

module.exports = router;
