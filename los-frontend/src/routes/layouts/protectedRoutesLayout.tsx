import { AppSidebar } from '@/components/app-sidebar';
import DashBoardWrapper from '@/components/shared/DashBoardWrapper';
import { TopHeader } from '@/components/top-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LoadingProvider } from '@/lib/contexts/Loader';
import { onMessageListen } from '@/lib/firebase/firebase';
import { FETCH_USERS_DETAILS } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import socketService from '@/socket';
import AutoSessionExpire from '@/utils/autoSessionExpire';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
// import SuspenseLoading from '@/routes/suspenseLoading';

export default function ProtectedRoutesLayout() {
  const dispatch = useDispatch();
  const { data: LoginData } = useSelector((state: RootState) => state.login);
  onMessageListen().then((payload: any) => {
    toast.info(() => (
      <div>
        <p> {payload.notification.title}</p>
        <p> {payload.notification.body}</p>
      </div>
    ));
  });
  useEffect(() => {
    dispatch({ type: FETCH_USERS_DETAILS });
  }, [dispatch]);

  useEffect(() => {
    socketService.initializeSocket();
    const socket = socketService.getSocket();
    return () => {
      socket.off('message');
    };
  }, [LoginData]);

  return (
    <LoadingProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full relative">
          <TopHeader />
          <div className="md:p-4 flex flex-col pb-5 relative border-l h-full bg-color-background">
            <AutoSessionExpire expireTime={30} />
            <DashBoardWrapper>
              <Outlet />
            </DashBoardWrapper>
          </div>
        </div>
      </SidebarProvider>
    </LoadingProvider>
  );
}
