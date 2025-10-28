import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/slices';

export const useLoginNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, organizations, token, loading } = useSelector((state: RootState) => state.login);

  const getStoredToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  const isValidAuthentication = useCallback(() => {
    const storedToken = getStoredToken();
    return (
      token && token.length > 0 && storedToken === token && isAuthenticated && organizations && organizations.length > 0
    );
  }, [token, isAuthenticated, organizations, getStoredToken]);

  const getDefaultOrganizationRoute = useCallback(() => {
    if (!organizations || organizations.length < 1) return null;

    const firstOrg = organizations[0];
    const orgName = typeof firstOrg === 'string' ? firstOrg : firstOrg.id;

    return orgName ? `/app/${orgName}/profile` : null;
  }, [organizations]);

  useEffect(() => {
    if (loading) return;

    const isOnLoginPage = location.pathname === '/login';
    const isUserAuthenticated = isValidAuthentication();
    const storedToken = getStoredToken();

    if (isUserAuthenticated) {
      // User is authenticated, navigate to organization route
      const orgRoute = getDefaultOrganizationRoute();
      if (orgRoute && location.pathname !== orgRoute) {
        console.log('Navigating to authenticated route:', orgRoute);
        navigate(orgRoute, { replace: true });
      }
    } else if (!isOnLoginPage && !storedToken) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [navigate, location.pathname, loading, isValidAuthentication, getDefaultOrganizationRoute, getStoredToken]);

  return {
    isAuthenticated: isValidAuthentication(),
    isLoading: loading,
    hasOrganizations: organizations && organizations.length > 0,
  };
};
