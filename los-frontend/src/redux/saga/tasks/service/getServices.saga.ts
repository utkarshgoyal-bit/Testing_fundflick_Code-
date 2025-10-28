import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IServiceTable } from '@/lib/interfaces/tables';
import { FETCH_SERVICES } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError, setTotalServices } from '@/redux/slices/services';
import { RootState } from '@/redux/store';
import { call, put, select, takeEvery } from 'redux-saga/effects';
function* fetchServicesSaga(action: {
  type: string;
  payload: {
    silent?: boolean;
    filter?: {
      activeFilter?: string;
      statusFilter?: string;
    };
  };
}) {
  if (!action.payload?.silent) {
    yield put(setLoading({ loading: true, message: 'Fetching Services...' }));
  }
  try {
    const { activePage } = yield select((state: RootState) => state.service);
    const response: ApiResponse<{ data: IServiceTable[]; total: number }> = yield call(
      apiCaller,
      `/service?page=${activePage}`
    );
    if (response.data) {
      yield put(setData(response.data));
      yield put(setTotalServices(response.data.total));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    if (!action.payload?.silent) {
      yield put(setLoading({ loading: false }));
    }
  }
}

export default function* fetchServices() {
  yield takeEvery(FETCH_SERVICES, fetchServicesSaga);
}
