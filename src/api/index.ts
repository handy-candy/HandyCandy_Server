import express from 'express';

const router = express.Router();

router.use('/candies', require('./candies'));
router.use('/userInfo', require('./userInfo'));
router.use('/users', require('./user'));
router.use('/category', require('./category'));
router.use('/candy', require('./candy'));
router.use('/search', require('./search'));

export default router;
