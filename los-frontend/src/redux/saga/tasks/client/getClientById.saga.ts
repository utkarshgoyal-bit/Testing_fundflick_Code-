import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IClientTable } from '@/lib/interfaces/tables';
import { FETCH_CLIENT_BY_ID, FETCH_SERVICES } from '@/redux/actions/types';
import { setError, setSelectedClient } from '@/redux/slices/client';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';
function* fetchClientByIdSaga(action: {
  type: string;
  payload: {
    id: string;
  };
}) {
  try {
    if (action.payload.id) {
      yield put({ type: FETCH_SERVICES });
    }
    const response: ApiResponse<{ data: IClientTable[]; total: number }> = yield call(
      apiCaller,
      `/client/${action.payload.id}`
    );
    if (response.data) {
      yield put(setSelectedClient(response.data));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* fetchClientById() {
  yield takeEvery(FETCH_CLIENT_BY_ID, fetchClientByIdSaga);
}
