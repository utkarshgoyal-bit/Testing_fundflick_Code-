import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { IServiceTable, ServiceAction } from '@/lib/interfaces';
import { EDIT_SERVICE } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError } from '@/redux/slices/services';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editServiceSaga(action: ServiceAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ services: IServiceTable[] }> = yield call(
      apiCaller,
      '/service',
      'PUT',
      payload,
      true,
      {
        pending: 'Updating Service...',
        success: 'Service updated successfully',
        error: 'An error occurred while updating service',
      }
    );
    if (response.data) {
      yield put(setData(response.data.services));
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

export default function* editService() {
  yield takeEvery(EDIT_SERVICE, editServiceSaga);
}
