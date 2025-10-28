import NotFound from '@/pages/404';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoutesLayout from './layouts/protectedRoutesLayout';
import PublicRoutesLayout from './layouts/publicRoutesLayout';
import protectedRoutes from './protectedRoutes';
import PublicRoutes from './publicRoutes';
import SuspenseLoading from './suspenseLoading';

export default function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseLoading />}>
      <Routes>
        <Route path="/app/:organization/*" element={<ProtectedRoutesLayout />}>
          {protectedRoutes()}
        </Route>
        <Route element={<PublicRoutesLayout />}>{PublicRoutes()}</Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
