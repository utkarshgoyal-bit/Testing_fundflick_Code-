import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ServiceAction } from '@/lib/interfaces';
import { IServiceTable } from '@/lib/interfaces/tables';
import { DELETE_SERVICE, FETCH_SERVICES } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/services';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteServiceSaga(action: ServiceAction) {
  yield put(setLoading({ loading: true, message: 'Deleting Service...' }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ services: IServiceTable[] }> = yield call(
      apiCaller,
      '/service',
      'DELETE',
      payload,
      true,
      {
        pending: 'Deleting Service...',
        success: 'Service deleted successfully',
        error: 'An error occurred while deleting service',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_SERVICES, payload: { silent: false } });
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

export default function* deleteService() {
  yield takeEvery(DELETE_SERVICE, deleteServiceSaga);
}
