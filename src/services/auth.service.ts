import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { LoginRequest, SafeUser } from '../types';

export class AuthService {
  static async login(data: LoginRequest) {
    const { username, password } = data;

    let user = await User.findOne({ where: { username } });

    if (!user) {
      if (username === 'root' && password === '123') {
        const hashedPassword = await bcrypt.hash('123', 10);
        user = await User.create({
          username: 'root',
          password: hashedPassword,
        });
      } else {
        throw new Error('用户名或密码不正确');
      }
    } else {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('用户名或密码不正确');
      }
    }

    user.loginTime = new Date();
    await user.save();

    const secret = process.env.JWT_SECRET || 'your-secret-key-here-change-it-in-production';
    const expiresInValue = process.env.JWT_EXPIRES_IN || '7d';
    const token = (jwt.sign as any)(
      { userId: user.id, username: user.username },
      secret,
      { expiresIn: expiresInValue }
    );

    const safeUser: SafeUser = {
      id: user.id,
      username: user.username,
      loginTime: user.loginTime,
    };

    return { user: safeUser, token };
  }

  static async getCurrentUser(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    const safeUser: SafeUser = {
      id: user.id,
      username: user.username,
      loginTime: user.loginTime,
    };

    return safeUser;
  }
}
