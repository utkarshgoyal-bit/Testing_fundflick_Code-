import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IServiceTable } from '@/lib/interfaces/tables';
import { FETCH_SERVICE_BY_ID } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError, setSelectedService } from '@/redux/slices/services';
import { call, put, takeEvery } from 'redux-saga/effects';
function* fetchServiceByIdSaga(action: {
  type: string;
  payload: {
    id: string;
  };
}) {
  try {
    const response: ApiResponse<{ data: IServiceTable[]; total: number }> = yield call(
      apiCaller,
      `/service/${action.payload.id}`
    );
    if (response.data) {
      yield put(setSelectedService(response.data));
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

export default function* fetchServicesById() {
  yield takeEvery(FETCH_SERVICE_BY_ID, fetchServiceByIdSaga);
}
