import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ClientAction } from '@/lib/interfaces';
import { IClientTable } from '@/lib/interfaces/tables';
import { DELETE_CLIENT, FETCH_CLIENTS } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/client';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteClientSaga(action: ClientAction) {
  yield put(setLoading({ loading: true, message: 'Deleting Client...' }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ clients: IClientTable[] }> = yield call(
      apiCaller,
      '/client',
      'DELETE',
      payload,
      true,
      {
        pending: 'Deleting Client...',
        success: 'Client deleted successfully',
        error: 'An error occurred while deleting client',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_CLIENTS, payload: { silent: false } });
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

export default function* deleteClients() {
  yield takeEvery(DELETE_CLIENT, deleteClientSaga);
}
