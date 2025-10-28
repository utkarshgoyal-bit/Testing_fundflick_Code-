import { APP_MODULES, PROTECTED_ROUTES, ROLES_ENUM } from '@/lib/enums';
import protectedRoutesConfig from '@/routes/protectedRoutesConfig';
import { RootState } from '@/redux/store';
import { isSalesMan } from '@/helpers/checkUserRole';
import { useSelector } from 'react-redux';
import { Navigate, Route } from 'react-router-dom';

export default function ProtectedRoutes() {
  const { role, modules } = useSelector((state: RootState) => state.login);

  return (
    <>
      {protectedRoutesConfig
        .filter((route) => route.module == APP_MODULES.COMMON || modules?.includes(route.module as string))
        .map((route) =>
          route.children ? (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children?.map((child) => <Route key={child.path} path={child.path} element={child.element} />)}
            </Route>
          ) : (
            <Route key={route.path} path={route.path} element={route.element} />
          )
        )}
      <Route
        index
        element={
          <Navigate
            to={isSalesMan(role as ROLES_ENUM) ? PROTECTED_ROUTES.CUSTOMER_FILE_MANAGEMENT : PROTECTED_ROUTES.PROFILE}
            replace
          />
        }
      />
    </>
  );
}
