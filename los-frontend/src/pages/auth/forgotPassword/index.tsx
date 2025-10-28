import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { PUBLICROUTES } from '@/lib/enums/index';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ForgotPasswordForm, ForgotPasswordSchema } from './form';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import moment from 'moment';

export default function ForgotPassword() {
  const navigation = useNavigate();
  const { error, token, organizations } = useSelector((state: RootState) => state.login);

  const onSubmit = (data: ForgotPasswordSchema) => {
    console.log(data);
  };
  useEffect(() => {
    if (token.length > 0 && token !== '' && localStorage.getItem('token') === token && organizations) {
      navigation(`/app/${organizations[0]?.name}/profile`);
    }
  }, [navigation, token]);
  return (
    <div className="flex justify-center items-center h-screen bg-[url('/loginBg.jpg')] bg-no-repeat bg-cover">
      <Card className="md:w-[500px] w-[90%] shadow-lg">
        <CardHeader className="text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto h-10 w-auto" />
          <CardDescription className="mt-2 text-gray-600">
            <I8nTextWrapper text="forgotPassword" />
          </CardDescription>
          {error && <CardDescription className="mt-2 text-destructive">{error}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm onSubmit={onSubmit} />
          <Link to={PUBLICROUTES.LOGIN} className="text-blue-400 pt-2  border-b flex w-fit  border-blue-400">
            <I8nTextWrapper text="backToLogin" />
          </Link>
          <p className="text-center text-sm text-gray-500 my-2">
            ©{moment().format('YYYY')} Maitrii. All rights reserved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
