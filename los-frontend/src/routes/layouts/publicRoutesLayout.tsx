import { Outlet } from 'react-router-dom';

export default function PublicRoutesLayout() {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}
