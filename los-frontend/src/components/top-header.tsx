import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { RootState } from '@/redux/store';
import { Bell, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LOGOUT } from '@/redux/actions/types';
import Notifications from '@/routes/layouts/notifications';
import { PROTECTED_ROUTES } from '@/lib/enums';
import { Calendar, Clock } from 'lucide-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { isDev } from '@/lib/utils';

export function TopHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state: RootState) => state.notification);
  const { data: loggedInUser }: { data: any } = useSelector((state: RootState) => state.login);
  const { employment, avatar: userAvatar }: { employment: any; avatar: any } = loggedInUser || {};
  const { firstName, lastName, email } = employment || {};
  const unreadCount = data.filter((msg: any) => !msg.readStatus).length;
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    dispatch({ type: LOGOUT });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userFullName = (firstName || '') + ' ' + (lastName || '');
  const userEmail = email || '';
  const currentDate = moment().format('MMMM Do, YYYY');
  const [currentTime, setCurrentTime] = useState(moment().local().format('HH:mm:ss.SSS A'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().local().format('HH:mm:ss'));
    }, 1);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full flex sticky top-0 py-3 px-4 justify-between items-center bg-color-surface border-b border-fg-border backdrop-blur supports-[backdrop-filter]:bg-color-surface/95 z-30">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-fg-secondary hover:text-fg-primary hover:bg-color-surface-muted" />
        {firstName && lastName && (
          <div className="flex items-center gap-2">
            <span className="text-fg-tertiary text-sm hidden sm:block">
              <I8nTextWrapper text="welcome" />,
            </span>
            <span className="text-fg-primary font-medium text-sm">{userFullName}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-fg-tertiary">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{currentDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{currentTime}</span>
          </div>
        </div>
        {/* Theme Toggle */}
        {isDev && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-fg-secondary hover:text-fg-primary hover:bg-color-surface-muted"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
        )}

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-fg-secondary hover:text-fg-primary hover:bg-color-surface-muted relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] flex justify-center items-center bg-color-error rounded-full h-5 w-5 text-white">
                  {Number(unreadCount) > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] max-h-[50vh] overflow-auto bg-color-surface border border-fg-border">
            <Notifications />
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-color-surface-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userFullName} />
                <AvatarFallback className="bg-color-primary text-fg-inverse text-xs">
                  {getUserInitials(userFullName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-color-surface border border-fg-border" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-fg-primary">{userFullName}</p>
                <p className="text-xs leading-none text-fg-tertiary">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-fg-border" />
            <DropdownMenuItem
              className="text-fg-secondary hover:text-fg-primary hover:bg-color-surface-muted cursor-pointer"
              onClick={() => navigate(PROTECTED_ROUTES.PROFILE)}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-fg-secondary hover:text-fg-primary hover:bg-color-surface-muted cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-fg-border" />
            <DropdownMenuItem
              className="text-color-error hover:text-color-error hover:bg-color-surface-muted cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
