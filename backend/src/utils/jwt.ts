import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const JWT_SECRET = env.JWT_SECRET;

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  // Access JWTs are intentionally short-lived; the server-revocable refresh token extends sessions.
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
