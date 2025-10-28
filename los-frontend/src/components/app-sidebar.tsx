import { useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from '@/components/ui/sidebar';
import { isSuperAdmin } from '@/helpers/checkUserRole';
import hasPermission from '@/helpers/hasPermission';
import { APP_MODULES, ROLES_ENUM } from '@/lib/enums';
import { IRoute } from '@/lib/interfaces';
import { RootState } from '@/redux/store';
import ProtectedRoutesArray from '@/routes/protectedRoutesConfig';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronRight, Coins, User, University, IndianRupee, CalendarCheck, FolderOpen } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { isDev } from '@/lib/utils';

export function AppSidebar() {
  const { role, modules } = useSelector((state: RootState) => state.login);
  const { setOpenMobile, openMobile, isMobile, setWidth, width } = useSidebar();
  const selectedEnvironment = isDev ? 'DEV' : '';
  const [isHoverEnabled, setIsHoverEnabled] = useState(() => {
    const saved = localStorage.getItem('sidebarHoverEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      setWidth(savedWidth);
    }
  }, []);

  const navLinkClasses = (isActive: boolean) =>
    `text-sm flex items-center gap-2 border-transparent overflow-hidden border-l-4 px-2 w-full py-2 transition-all duration-200 hover:bg-color-surface-muted
        ${isActive ? 'font-bold text-fg-primary border-color-accent bg-color-surface-muted' : 'text-fg-secondary hover:text-fg-primary'} 
        whitespace-nowrap overflow-hidden text-ellipsis`;
  function routerPermissionsHandler(route: IRoute) {
    return hasPermission(route.permissionName) || isSuperAdmin(role) || route.permissionName === ROLES_ENUM.ALL;
  }

  const getGroupRoutes = (group: string) => {
    return ProtectedRoutesArray.filter(
      (item) => item.group === group && modules?.includes(item.module as string) && routerPermissionsHandler(item)
    );
  };

  const hasModuleAccess = (module: string) => {
    return modules?.includes(module as string);
  };
  const hasOrgAccess =
    hasModuleAccess(APP_MODULES.ORGANIZATION) && isSuperAdmin(role) && getGroupRoutes('organization').length > 0;

  const hasLoanManagementAccess = hasModuleAccess(APP_MODULES.LMS) && getGroupRoutes('lms').length > 0;

  return (
    <Sidebar
      onMouseEnter={() => {
        if (isHoverEnabled) setWidth('16rem');
      }}
      onMouseLeave={() => {
        if (isHoverEnabled) setWidth('6rem');
      }}
      className="bg-color-surface border-r border-fg-border"
    >
      <SidebarContent className="bg-color-surface">
        <SidebarHeader className="border-b border-fg-border">
          <div className="flex flex-col items-center gap-2 px-1 font-bold my-5">
            <img src="/logo2.png" className="max-w-[4rem]" alt="Logo" />
            <span className="text-fg-primary font-bold text-sm">{selectedEnvironment}</span>
          </div>
        </SidebarHeader>

        <SidebarMenu className="px-2 py-4">
          {/* Common routes */}
          {ProtectedRoutesArray.filter(
            (route) =>
              (route.module === APP_MODULES.COMMON || modules?.includes(route.module as string)) &&
              route.group === 'common' &&
              routerPermissionsHandler(route)
          ).map((route) => (
            <SidebarMenuItem key={route.label}>
              <NavLink
                to={route.path}
                className={({ isActive }) => navLinkClasses(isActive)}
                onClick={() => isMobile && setOpenMobile(!openMobile)}
              >
                {route.icon}
                {(width === '16rem' || isMobile) && route.label}
              </NavLink>
            </SidebarMenuItem>
          ))}

          {hasModuleAccess(APP_MODULES.TASK) && getGroupRoutes('task').length > 0 && (
            <Collapsible defaultOpen className="group/los">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="font-bold text-fg-primary hover:bg-color-surface-muted hover:text-fg-primary">
                    <CalendarCheck size={20} className="font-bold" />
                    {(width === '16rem' || isMobile) && <span>Tasks Management</span>}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {getGroupRoutes('task').map((route) => (
                      <SidebarMenuItem key={route.label}>
                        <NavLink
                          to={route.path}
                          className={({ isActive }) => navLinkClasses(isActive)}
                          onClick={() => isMobile && setOpenMobile(!openMobile)}
                        >
                          {route.icon}
                          {(width === '16rem' || isMobile) && route.label}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}
          {hasModuleAccess(APP_MODULES.LOS) && getGroupRoutes('los').length > 0 && (
            <Collapsible defaultOpen className="group/los">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="font-bold text-fg-primary hover:bg-color-surface-muted hover:text-fg-primary">
                    <FolderOpen size={20} className="font-bold" />
                    {(width === '16rem' || isMobile) && <span>LOS</span>}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {getGroupRoutes('los').map((route) => (
                      <SidebarMenuItem key={route.label}>
                        <NavLink
                          to={route.path}
                          className={({ isActive }) => navLinkClasses(isActive)}
                          onClick={() => isMobile && setOpenMobile(!openMobile)}
                        >
                          {route.icon}
                          {(width === '16rem' || isMobile) && route.label}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}

          {/* Collection */}
          {hasModuleAccess(APP_MODULES.COLLECTION) && getGroupRoutes('collection').length > 0 && (
            <Collapsible defaultOpen className="group/collection">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="font-bold text-fg-primary hover:bg-color-surface-muted hover:text-fg-primary">
                    <Coins size={19} />
                    {(width === '16rem' || isMobile) && <span>Collection</span>}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {getGroupRoutes('collection').map((route) => (
                      <SidebarMenuItem key={route.label}>
                        <NavLink
                          to={route.path}
                          className={({ isActive }) => navLinkClasses(isActive)}
                          onClick={() => isMobile && setOpenMobile(!openMobile)}
                        >
                          {route.icon}
                          {(width === '16rem' || isMobile) && route.label}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}

          {/* Admin */}
          {hasModuleAccess(APP_MODULES.ADMIN) && getGroupRoutes('admin').length > 0 && (
            <Collapsible defaultOpen className="group/admin">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="font-bold text-fg-primary hover:bg-color-surface-muted hover:text-fg-primary">
                    <User size={19} /> {(width === '16rem' || isMobile) && <span>Admin</span>}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {getGroupRoutes('admin').map((route) => (
                      <SidebarMenuItem key={route.label}>
                        <NavLink
                          to={route.path}
                          className={({ isActive }) => navLinkClasses(isActive)}
                          onClick={() => isMobile && setOpenMobile(!openMobile)}
                        >
                          {route.icon}
                          {(width === '16rem' || isMobile) && route.label}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}

          {hasOrgAccess && (
            <Collapsible defaultOpen className="group/developer">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="font-bold text-fg-primary hover:bg-color-surface-muted hover:text-fg-primary">
                    <University size={19} /> {(width === '16rem' || isMobile) && <span>Organizations Manager</span>}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {getGroupRoutes('organization').map((route) => (
                      <SidebarMenuItem key={route.label}>
                        <NavLink
                          to={route.path}
                          className={({ isActive }) => navLinkClasses(isActive)}
                          onClick={() => isMobile && setOpenMobile(!openMobile)}
                        >
                          {route.icon}
                          {(width === '16rem' || isMobile) && route.label}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}
          {getGroupRoutes('client').length > 0 && (
            <SidebarMenuItem>
              {getGroupRoutes('client').map((route) => (
                <NavLink
                  key={route.label}
                  to={route.path}
                  className={({ isActive }) => navLinkClasses(isActive)}
                  onClick={() => isMobile && setOpenMobile(!openMobile)}
                >
                  {route.icon}
                  {(width === '16rem' || isMobile) && route.label}
                </NavLink>
              ))}
            </SidebarMenuItem>
          )}
          {getGroupRoutes('taskForCA').length > 0 && (
            <SidebarMenuItem>
              {getGroupRoutes('taskForCA').map((route) => (
                <NavLink
                  key={route.label}
                  to={route.path}
                  className={({ isActive }) => navLinkClasses(isActive)}
                  onClick={() => isMobile && setOpenMobile(!openMobile)}
                >
                  {route.icon}
                  {(width === '16rem' || isMobile) && route.label}
                </NavLink>
              ))}
            </SidebarMenuItem>
          )}
          {hasLoanManagementAccess && (
            <Collapsible defaultOpen className="group/developer">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="font-bold text-fg-primary hover:bg-color-surface-muted hover:text-fg-primary">
                    <IndianRupee size={19} /> {(width === '16rem' || isMobile) && <span>Loan Management System</span>}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {getGroupRoutes('lms').map((route) => (
                      <SidebarMenuItem key={route.label}>
                        <NavLink
                          to={route.path}
                          className={({ isActive }) => navLinkClasses(isActive)}
                          onClick={() => isMobile && setOpenMobile(!openMobile)}
                        >
                          {route.icon}
                          {(width === '16rem' || isMobile) && route.label}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-fg-border bg-color-surface p-2 flex flex-col gap-2 relative min-h-[3rem]">
        <button
          onClick={(e) => {
            e.preventDefault();
            const newHoverState = !isHoverEnabled;
            setIsHoverEnabled(newHoverState);
            localStorage.setItem('sidebarHoverEnabled', JSON.stringify(newHoverState));

            const newWidth = newHoverState ? '6rem' : '16rem';
            setWidth(newWidth);
            localStorage.setItem('sidebarWidth', newWidth);
          }}
          title={isHoverEnabled ? 'Disable hover expand' : 'Enable hover expand'}
          aria-label={isHoverEnabled ? 'Disable hover expand' : 'Enable hover expand'}
          className="absolute  flex items-center justify-center rounded-lg p-1 hover:bg-color-surface-muted transition-colors cursor-pointer"
        >
          <ChevronRight
            size={16}
            className={`${isHoverEnabled ? 'rotate-0' : 'rotate-180'} transition-transform duration-300`}
          />
        </button>
        {width === '16rem' && <span className="ml-8 text-sm relative top-[1px] ">Collapse navbar</span>}
      </SidebarFooter>
    </Sidebar>
  );
}
