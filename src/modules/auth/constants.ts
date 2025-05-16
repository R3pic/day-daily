import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
  sameSite: 'none',
  secure: true,
  httpOnly: true,
};