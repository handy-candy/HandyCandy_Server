import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';
import { check, validationResult } from 'express-validator';

const router = express.Router();

import User from '../models/User';

/**
 *  @route Post api/users/signUp
 *  @desc Register User
 *  @access Public
 */
router.post(
  '/signUp',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('nickname', 'Name is required').not().isEmpty(),
    check('gender', 'Gender is required').not().isEmpty(),
    check('birth', 'Birth is required').not().isEmpty(),
    check('notice_agreement', 'Notice agreement is required').not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, nickname, gender, birth, notice_agreement } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        res.status(400).json({
          errors: [{ msg: 'User already exists' }],
        });
      }

      user = new User({
        email,
        password,
        nickname,
        gender,
        birth,
        notice_agreement,
      });

      await user.save();
      const salt = await bcrypt.genSalt(10);
      user.salt = salt;
      user.password = await bcrypt.hash(password, salt);

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' }, async (err, token) => {
        if (err) throw err;
        await user.save();
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

/**
 *  @route Post api/users/signIn
 *  @desc Login User
 *  @access Public
 */
router.post(
  '/signIn',
  [check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists()],
  async (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        res.status(400).json({
          errors: [{ msg: 'Invalid Credentials' }],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({
          errors: [{ msg: 'Invalid Credentials' }],
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

module.exports = router;
