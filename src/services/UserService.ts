import { SignInDto, SignUpDto } from '../dto/user.dto';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';
export class UserService {
  static async signUp(user_dto: SignUpDto) {
    try {
      let user = await User.findOne({ email: user_dto.email });

      if (user) {
        return {
          message: 'User already exists',
        };
      }

      user = new User(user_dto);

      const salt = await bcrypt.genSalt(10);
      user.salt = salt;
      user.password = await bcrypt.hash(user_dto.password, salt);

      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      const token = await jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
      return token;
    } catch (err) {
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }

  static async signIn(user_dto: SignInDto) {
    try {
      let user = await User.findOne({ email: user_dto.email });

      if (!user) {
        return {
          message: 'Invalid Credentials',
        };
      }

      const is_match = await bcrypt.compare(user_dto.password, user.password);
      if (!is_match) {
        return {
          message: 'Invalid Credentials',
        };
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const token = await jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
      return token;
    } catch (err) {
      console.error(err.message);
      return {
        message: 'Server Error',
      };
    }
  }
}
