import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ClientAction } from '@/lib/interfaces';
import { IClientTable } from '@/lib/interfaces/tables';
import { EDIT_CLIENT } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError } from '@/redux/slices/client';
import { call, put, takeEvery } from 'redux-saga/effects';
import { buildOrgRoute } from '@/helpers/routeHelper';

function* editClientSaga(action: ClientAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ clients: IClientTable[] }> = yield call(apiCaller, '/client', 'PUT', payload, true, {
      pending: 'Updating Client...',
      success: 'Client updated successfully',
      error: 'An error occurred while updating client',
    });
    if (response.data) {
      yield put(setData(response.data.clients));
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

export default function* editClient() {
  yield takeEvery(EDIT_CLIENT, editClientSaga);
}
