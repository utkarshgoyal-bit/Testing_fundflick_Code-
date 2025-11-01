import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IClientTable, UpdateClientLedgerAction } from '@/lib/interfaces';
import { FETCH_CLIENT_LEDGER, UPDATE_CLIENT_LEDGER } from '@/redux/actions/types';
import { setError } from '@/redux/slices/client';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* updateClientLedgerSaga(action: UpdateClientLedgerAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ clients: IClientTable[] }> = yield call(
      apiCaller,
      `/client-ledger`,
      'PUT',
      payload,
      false
    );
    if (response.error) {
      yield put(setError(response.error));
    } else {
      yield put({ type: FETCH_CLIENT_LEDGER });
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* updateClientLedger() {
  yield takeEvery(UPDATE_CLIENT_LEDGER, updateClientLedgerSaga);
}
