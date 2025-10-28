import { RootState } from '@/redux/store';
import { setLoading } from '@/redux/slices/publicSlice';
import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SquareLoader } from 'react-spinners';

const LoadingContext = createContext({
  loading: false,
  startLoading: () => {},
  stopLoading: () => {},
});
export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { loading, message } = useSelector((state: RootState) => state.publicSlice);
  const startLoading = () => dispatch(setLoading({ loading: true }));
  const stopLoading = () => dispatch(setLoading({ loading: true }));
  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {loading && (
        <div className="fixed z-[999] top-0 left-0 w-full h-full bg-gradient-to-r from-secondary via-secondary to-secondary opacity-80  flex flex-col justify-center items-center">
          <SquareLoader size={60} color={'#213555'} speedMultiplier={0.5} />
          <p className="text-white/80  mt-3"> {message}</p>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};
