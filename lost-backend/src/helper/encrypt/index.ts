import bcrypt from 'bcryptjs';
import Logger from '../../lib/logger';
const SALT = process.env.JWT_SECRET_SALT || '10';
const secret_key = process.env.JWT_SECRET || '';
const encrypt = async (password: string) => {
  try {
    return await bcrypt.hashSync(password, +SALT);
  } catch (error) {
    Logger.error(error);
    return '';
  }
};
const checkPassword = async (password: string, hash: string) => {
  try {
    const isMatched = bcrypt.compareSync(String(password), String(hash));
    return isMatched;
  } catch (error) {
    Logger.error(error);
    return false;
  }
};

export { checkPassword, encrypt };
