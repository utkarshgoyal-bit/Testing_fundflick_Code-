import { SquareLoader } from 'react-spinners';

export default function SuspenseLoading() {
  return (
    <div className="fixed z-[999] top-0 left-0 w-full h-full bg-gradient-to-r from-secondary via-secondary to-secondary opacity-80  flex flex-col justify-center items-center">
      <SquareLoader size={60} color={'#213555'} speedMultiplier={0.5} />
      <p>Loading component</p>
    </div>
  );
}
