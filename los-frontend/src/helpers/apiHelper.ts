import { setIsAuthenticated } from '@/redux/slices/login';
import store from '@/redux/store';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

const apiCaller = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: unknown,
  toaster?: boolean,
  toasterMessages?: {
    pending: string;
    success: string;
    error: string;
  },
  headers?: Record<string, string>,
  customURL?: string
): Promise<ApiResponse<T> | AxiosError<unknown>> => {
  const response: ApiResponse<T> = {
    data: null,
    error: null,
  };

  try {
    const organization = store
      .getState()
      .login.organizations?.find((org: any) => org.id === location.pathname.split('/')[2]) || { _id: '' };
    const axiosInstance = axios.create({
      baseURL: customURL || import.meta.env.VITE_SERVER_BASE_URI,
      headers: {
        'Content-Type': 'application/json',
        Authorization: store.getState().login.token || localStorage.getItem('token'),
        organization: organization?._id,
        ...headers,
      },
      // withCredentials: true,dd
    });
    const res = axiosInstance(url, {
      method,
      data: body,
    });
    if (toaster) {
      toast.promise(res, {
        pending: toasterMessages?.pending,
        success: toasterMessages?.success,
        error: {
          render({ data }: { data: AxiosError<any> }) {
            return (
              `${data.response?.data?.errorMessage || data?.message}` ||
              toasterMessages?.error ||
              'An unexpected error occurred'
            );
          },
        },
      });
    }
    const finalRes = await res;

    response.data = finalRes?.data?.data || finalRes?.data?.result;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      localStorage.clear();
      store.dispatch(setIsAuthenticated(false));
      window.location.href = '/login';
    }
    if (err instanceof AxiosError && err.response?.status === 406) {
      window.location.href = '/404';
    }
    if (axios.isAxiosError(err)) {
      return err;
    }
    response.error = 'An unexpected error occurred';
  }

  return response;
};

export default apiCaller;
