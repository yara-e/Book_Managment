import * as AuthRepo from './auth.repository';
import { hashPassword, comparePassword } from './utils/hash.util';
import { createAccessToken } from "./utils/jwt.util";
import { AppError } from '../../common/error/AppError';
import crypto from 'crypto';
import * as MailService from '../mail/mail.service';

export const register = async (userData: any) => {
  const existingUser = await AuthRepo.findUserByEmailRepo(userData.email);
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await hashPassword(userData.password);

  const user = await AuthRepo.createUser({
    ...userData,
    password: hashedPassword
  });


  const { password, id, ...userResponse } = user;  //...userResponse is all user data except the password and id
  return userResponse;
};

export const login = async (credentials: any) => {
  const user = await AuthRepo.findUserByEmailRepo(credentials.email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await comparePassword(credentials.password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = createAccessToken({
    uuid: user.uuid,
    role: user.role
  });

  return {
    token,
    user: {
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};

export const forgotPassword = async (email: string) => {
  const user = await AuthRepo.findUserByEmailRepo(email);
  if (!user) throw new AppError("No user found with that email", 404);

  // Generate a random 64-character hex string
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 3600000); // 1 hour from now

  await AuthRepo.updateResetToken(user.id, token, expiry);
  await MailService.sendResetEmail(user.email, user.name, token);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await AuthRepo.findUserByValidToken(token);
  if (!user) throw new AppError("Token is invalid or expired", 400);

  const hashedPassword = await hashPassword(newPassword);

  await AuthRepo.updatePasswordAndClearToken(user.id, hashedPassword);
};