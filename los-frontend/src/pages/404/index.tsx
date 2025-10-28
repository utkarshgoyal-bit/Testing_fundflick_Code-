import { Button } from '@/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        color: '#1e293b',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
      <h2 style={{ margin: '1rem 0' }}>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <div className="flex justify-center items-center gap-3 mt-3">
        <Button variant={'outline'} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant={'outline'} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
