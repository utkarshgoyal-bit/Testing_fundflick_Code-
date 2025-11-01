import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ClientLedgerAction, IClientTable } from '@/lib/interfaces';
import { FETCH_CLIENT_LEDGER_BY_ID } from '@/redux/actions/types';
import { setError } from '@/redux/slices/client';
import { setClientLedgerData } from '@/redux/slices/clientLedger';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getClientLedgerByIdSaga(action: ClientLedgerAction) {
  yield put(setLoading({ loading: true }));
  try {
    const response: ApiResponse<{ clients: IClientTable[] }> = yield call(
      apiCaller,
      `/client-ledger/${action.payload?.ledgerId}`,
      'GET',
      {},
      false
    );
    if (response.data) {
      yield put(setClientLedgerData(response.data));
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

export default function* getClientLedgerById() {
  yield takeEvery(FETCH_CLIENT_LEDGER_BY_ID, getClientLedgerByIdSaga);
}
