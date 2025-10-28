import { default as Logger } from '../lib/logger';
const safeJsonParse = (string: any) => {
  try {
    return JSON.parse(string);
  } catch (error: any) {
    Logger.error(error);
    return {};
  }
};
export default safeJsonParse;
