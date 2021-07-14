import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { SignInDto, SignUpDto } from '../dto/user.dto';
import { UserService } from '../services';
const router = express.Router();

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const signup_dto: SignUpDto = {
      email: req.body.email,
      password: req.body.password,
      nickname: req.body.nickname,
      gender: req.body.gender,
      birth: req.body.birth,
      notice_agreement: req.body.notice_agreement,
    };

    const result = await UserService.signUp(signup_dto);
    if (result.message === 'User already exists') {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    } else if (result.message === 'Server Error') {
      res.status(500).send('Server Error');
    } else {
      res.status(200).json({ token: result });
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const signin_dto: SignInDto = {
      email: req.body.email,
      password: req.body.password,
    };

    const result = await UserService.signIn(signin_dto);
    if (result.message === 'Invalid Credentials') {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    } else if (result.message === 'Server Error') {
      res.status(500).send('Server Error');
    } else {
      res.status(200).json({ token: result });
    }
  },
);

module.exports = router;
