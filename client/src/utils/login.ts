import bcrypt from 'bcryptjs';
import { setClientSideCookie } from './cookies';
import { COOKIE_SESSION_NAME } from './const';

////////////////////////////////////////////////////////////////////////////////

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

////////////////////////////////////////////////////////////////////////////////

export const logout = () => {
  setClientSideCookie(COOKIE_SESSION_NAME, '', 0);
}
