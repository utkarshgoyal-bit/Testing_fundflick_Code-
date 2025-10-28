export const forceLogout = () => {
  localStorage.clear();
  sessionStorage.clear();

  document.cookie.split(';').forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });

  // Force redirect to login
  window.location.href = '/login';

  console.log('Emergency logout executed');
};
