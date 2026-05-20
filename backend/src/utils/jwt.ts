// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { IAuthPayload } from '../types';

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return secret;
};

export const signToken = (payload: IAuthPayload): string => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d',
  });
};

export const verifyToken = (token: string): IAuthPayload => {
  return jwt.verify(token, getSecret()) as IAuthPayload;
};
