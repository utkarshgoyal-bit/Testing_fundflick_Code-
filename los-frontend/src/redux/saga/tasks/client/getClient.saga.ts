import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IClientTable } from '@/lib/interfaces/tables';
import { FETCH_CLIENTS } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError, setTotalClients } from '@/redux/slices/client';
import { RootState } from '@/redux/store';
import { call, put, select, takeEvery } from 'redux-saga/effects';
function* fetchClientSaga(action: {
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
    yield put(setLoading({ loading: true }));
  }
  try {
    const { activePage } = yield select((state: RootState) => state.client);
    const response: ApiResponse<{ data: IClientTable[]; total: number }> = yield call(
      apiCaller,
      `/client?page=${activePage}`
    );
    if (response.data) {
      yield put(setData(response.data.data));
      yield put(setTotalClients(response.data.total));
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

export default function* fetchClients() {
  yield takeEvery(FETCH_CLIENTS, fetchClientSaga);
}
