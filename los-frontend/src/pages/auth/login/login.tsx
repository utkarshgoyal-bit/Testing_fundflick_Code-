import { LoginForm } from './form';
import { loginFormSchema } from '@/forms/validations';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { Helmet } from 'react-helmet';
import './login.css';
import moment from 'moment';
import { useLoginNavigation } from '@/hooks/useLoginNavigation';
const LoginV2 = ({
  loading,
  error,
  onSubmit,
}: {
  loading: boolean;
  error: any;
  onSubmit: (data: loginFormSchema) => void;
}) => {
  const { isAuthenticated } = useLoginNavigation();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>LOS | Login</title>
      </Helmet>
      <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="floating-bubble"
              style={{
                ...({
                  '--size': `${Math.random() * 10 + 6}rem`,
                  '--start-x': `${index % 2 === 0 ? '-10%' : '110%'}`,
                  '--end-x': `${index % 2 === 0 ? '110%' : '-10%'}`,
                  '--y-pos': `${index * 8 + Math.random() * 8}%`,
                  '--delay': `${index * 2}s`,
                  '--duration': '20s',
                } as React.CSSProperties), // This line tells TypeScript to accept custom properties
                position: 'absolute',
                width: 'var(--size)',
                height: 'var(--size)',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.4), rgba(33, 52, 85, 0.4))',
                top: 'var(--y-pos)',
                left: 'var(--start-x)',
                animationDelay: 'var(--delay)',
                animationDuration: 'var(--duration)',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationName: 'floatHorizontal',
                opacity: 0.15,
                boxShadow: '0 0 20px rgba(33, 52, 85, 0.3)',
                zIndex: 1,
                filter: 'blur(2px)',
                transform: 'translateZ(0)',
                willChange: 'transform',
              }}
            />
          ))}
        </div>

        {/* Left side - Logo section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-8 relative z-10">
          <div className="max-w-md relative">
            <img
              src="/logo2.png"
              alt="Logo"
              className="w-auto h-32 md:h-40 lg:h-40 transition-all duration-300 hover:scale-110 filter drop-shadow-xl relative z-10 animate-float"
              style={{
                animation: 'float 6s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative z-10">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
            <h1 className="text-3xl font-bold text-center text-primary mb-8">
              <I8nTextWrapper text="login" />
            </h1>
            <LoginForm onSubmit={onSubmit} loading={loading} error={error} className="w-full" />
            <p className="text-center text-sm text-gray-600 mt-6 flex justify-center items-center gap-1">
              <I8nTextWrapper text="copyright" />
              {moment().format('YYYY')} <I8nTextWrapper text="maitriiAllRightsReserved" />
            </p>
            {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginV2;
