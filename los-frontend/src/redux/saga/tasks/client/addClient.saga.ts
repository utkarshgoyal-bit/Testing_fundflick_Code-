import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ClientAction, IClientTable } from '@/lib/interfaces';
import { ADD_CLIENT, FETCH_CLIENTS } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/client';
import { call, put, takeEvery } from 'redux-saga/effects';
import { buildOrgRoute } from '@/helpers/routeHelper';

function* addClientSaga(action: ClientAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ clients: IClientTable[] }> = yield call(apiCaller, '/client', 'POST', payload, true, {
      pending: 'Creating New Client...',
      success: 'Client created successfully',
      error: 'An error occurred while creating client',
    });
    if (response.data) {
      yield put({ type: FETCH_CLIENTS, payload: { silent: false } });
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

export default function* addClient() {
  yield takeEvery(ADD_CLIENT, addClientSaga);
}
