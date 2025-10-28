import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Back = ({ navigateTo }: { navigateTo?: any }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(navigateTo || -1)}
      className="flex items-center justify-center h-10 w-10 rounded-full bg-color-surface-muted hover:bg-color-primary/10 transition-colors duration-200 group"
    >
      <ArrowLeft className="h-5 w-5 text-fg-secondary group-hover:text-color-primary transition-colors" />
    </button>
  );
};
export default Back;
