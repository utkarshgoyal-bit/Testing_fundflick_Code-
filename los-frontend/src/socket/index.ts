import store from '@/redux/store';
import { FETCH_CUSTOMER_FILES_DATA_SILENT } from '@/redux/actions/types';
import { addNewNotification, setData } from '@/redux/slices/notifications';
import io from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_SERVER_BASE_URI;

class SocketService {
  socket: any;

  constructor() {
    this.socket = null;
  }

  initializeSocket = async () => {
    try {
      console.log('Initializing Socket...');

      this.socket = io(ENDPOINT, {
        path: '/socket',
        transports: ['websocket'],
      });
      const organization = store
        .getState()
        .login.organizations?.find((org: any) => org.id === location.pathname.split('/')[2]) || {
        _id: '',
      };
      this.socket.on('connect', () => {
        console.log('Web socket Connected from frontend!');
        this.socket.emit('join', {
          employeeId: store.getState().login?.data?.employment._id,
          organization: organization._id,
        });
        this.socket.on('getAllNotifications', (notification: any) => {
          store.dispatch(setData(notification));
        });
        this.socket.on('notification', (notification: any) => {
          store.dispatch(addNewNotification(notification));
          store.dispatch({
            type: FETCH_CUSTOMER_FILES_DATA_SILENT,
          });
          const audio = new Audio('/notification-sound.wav');
          audio.play();
        });
      });
      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    } catch (error) {
      console.log('Socket initialization error: ', error);
    }
  };

  getSocket = () => {
    return this.socket;
  };
}

const socketService = new SocketService();
export default socketService;
