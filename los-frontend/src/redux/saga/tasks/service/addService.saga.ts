import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ServiceAction } from '@/lib/interfaces';
import { IServiceTable } from '@/lib/interfaces/tables';
import { ADD_SERVICE, FETCH_SERVICES } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/services';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addServiceSaga(action: ServiceAction) {
  try {
    yield put(setLoading({ loading: true }));
    const { payload } = action;
    const response: ApiResponse<{ services: IServiceTable[] }> = yield call(
      apiCaller,
      '/service',
      'POST',
      payload,
      true,
      {
        pending: 'Creating New Services...',
        success: 'Service created successfully',
        error: 'An error occurred while creating service',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_SERVICES, payload: { silent: false } });
      action.navigation(buildOrgRoute('/service-client'));
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

export default function* addService() {
  yield takeEvery(ADD_SERVICE, addServiceSaga);
}
