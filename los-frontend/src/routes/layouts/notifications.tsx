/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { FETCH_CUSTOMER_FILES_DATA } from '@/redux/actions/types';
import { setFiltersData } from '@/redux/slices/files';
import { readMessage, setData } from '@/redux/slices/notifications';
import { RootState } from '@/redux/store';
import socketService from '@/socket';
import { Bell, CheckCheck, Loader, Mail } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const formatRelativeTime = (date: string) => moment(date).fromNow();

const Notifications = () => {
  const { data, loading, unreadCount } = useSelector((state: RootState) => state.notification);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { filters } = useSelector((state: RootState) => state.customerFiles);
  const socket = socketService.getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDescription = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    if (!data.find((n: any) => n._id === id)?.readStatus) {
      dispatch(readMessage(id));
      socket.emit('markAsRead', { _id: id });
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = data.map((msg: any) => ({
      ...msg,
      readStatus: true,
    }));
    dispatch(setData(updatedNotifications));
    updatedNotifications.forEach((msg) => {
      socket.emit('markAsRead', { _id: msg._id });
    });
  };

  const handleNotificationClick = (loanId: number) => {
    if (loanId) {
      navigate(buildOrgRoute(ROUTES.CUSTOMER_FILE_MANAGEMENT));
      dispatch(setFiltersData({ ...filters, loanApplicationNumber: loanId.toString() }));
      dispatch({ type: FETCH_CUSTOMER_FILES_DATA });
    } else {
      navigate(buildOrgRoute(ROUTES.TASK_MANAGEMENT));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin text-color-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-color-background">
      {/* Header */}
      <div className="p-4 border-b border-fg-border">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-color-primary" />
            <h2 className="text-xl font-semibold text-color-primary">Notifications</h2>
            {unreadCount > 0 && (
              <div className="px-2.5 py-1 text-xs font-semibold text-white bg-color-error rounded-full">
                {unreadCount}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-color-secondary hover:bg-color-surface-muted"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {data.length === 0 ? (
            <div className="text-center py-20">
              <Bell className="mx-auto h-12 w-12 text-fg-tertiary" />
              <h3 className="mt-4 text-lg font-medium text-color-primary">No notifications yet</h3>
              <p className="mt-1 text-sm text-fg-secondary">We'll let you know when something important happens.</p>
            </div>
          ) : (
            data.map((notification: any) => {
              const { _id, title, message, createdAt, readStatus, loanApplicationNumber } = notification;
              const isExpanded = expanded[_id];

              return (
                <Card
                  key={_id}
                  className={cn(
                    'transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md border-l-4',
                    readStatus ? 'border-transparent' : 'border-color-primary bg-color-primary/5',
                    isExpanded ? 'bg-color-surface-muted' : 'bg-color-surface'
                  )}
                  onClick={() => toggleDescription(_id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div
                          className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center',
                            readStatus ? 'bg-color-surface-muted' : 'bg-color-primary text-white'
                          )}
                        >
                          <Bell size={16} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div
                            className="font-semibold text-color-primary hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(loanApplicationNumber);
                            }}
                          >
                            {title}
                          </div>
                          <div className="text-xs text-fg-tertiary whitespace-nowrap pl-4">
                            {formatRelativeTime(createdAt)}
                          </div>
                        </div>
                        <div
                          className={cn(
                            'text-sm text-fg-secondary transition-all duration-300 ease-in-out overflow-hidden',
                            isExpanded ? 'max-h-40 mt-2' : 'max-h-0'
                          )}
                        >
                          <p>{message}</p>
                        </div>
                      </div>
                      {!readStatus && <div className="w-2.5 h-2.5 rounded-full bg-color-primary mt-2" />}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Notifications;
