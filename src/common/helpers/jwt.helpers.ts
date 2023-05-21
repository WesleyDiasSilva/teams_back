import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function generateToken(user: User) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    image: user.image,
    name: user.name,
    last_name: user.last_name,
  };
  return {
    access_token: jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    }),
  };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
