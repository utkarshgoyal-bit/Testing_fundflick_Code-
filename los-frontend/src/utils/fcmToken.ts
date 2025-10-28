import apiCaller from '@/helpers/apiHelper';
import { requestForFCMToken } from '@/lib/firebase/firebase';

const fetchFCMToken = async () => {
  try {
    const token = await requestForFCMToken();
    if (token) {
      await apiCaller('/user/fcm-token', 'POST', { token: token });
    }
  } catch (error) {
    console.error('FCM registration error:', error);
  }
};
export default fetchFCMToken;
