import { RootState } from '@/redux/store';
import { LOGIN } from '@/redux/actions/types';
import { setError } from '@/redux/slices/login';
import { useDispatch, useSelector } from 'react-redux';
import { loginFormSchema } from '@/forms/validations';
import { currentOS, userAgent } from '@/utils/index';
import moment from 'moment';
import Login from './login';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state: RootState) => state.login);

  const onSubmit = (data: loginFormSchema) => {
    dispatch(setError(''));
    const payload = {
      ...data,
      os: currentOS,
      loggedIn: moment().unix(),
      browser: userAgent,
      updatedAt: moment().unix(),
    };
    dispatch({ type: LOGIN, payload });
  };

  return <Login loading={loading} error={error} onSubmit={onSubmit} />;
};

export default LoginPage;
