import moment from 'moment-timezone';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setToken } from './redux/slices/login';
import AppRoutes from './routes';
moment.tz.setDefault('Etc/UTC');
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setToken(localStorage.getItem('token') || ''));
  }, [dispatch]);
  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        stacked
        className={'h-8'}
        transition={Bounce}
      />
    </>
  );
}

export default App;
