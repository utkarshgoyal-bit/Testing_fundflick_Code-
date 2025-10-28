import { PUBLICROUTES } from '@/lib/enums/index';
import NotFound from '@/pages/404';
import { ReactElement, lazy } from 'react';
import { Route } from 'react-router-dom';
const Login = lazy(() => import('@/pages/auth/login'));
const ForgotPassword = lazy(() => import('@/pages/auth/forgotPassword'));
const publicRoutes: { path: string; element: ReactElement }[] = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: PUBLICROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: PUBLICROUTES.UPDATE_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: PUBLICROUTES.NOT_FOUND,
    element: <NotFound />,
  },
];
export default function PublicRoutes() {
  return (
    <>
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  );
}
