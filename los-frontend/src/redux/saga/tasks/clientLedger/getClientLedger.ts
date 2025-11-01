import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ClientLedgerAction, IClientTable } from '@/lib/interfaces';
import { FETCH_CLIENT_LEDGER } from '@/redux/actions/types';
import { setError } from '@/redux/slices/client';
import { setClientLedgerData } from '@/redux/slices/clientLedger';
import { setLoading } from '@/redux/slices/publicSlice';
import moment from 'moment';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getClientLedgerSaga(action: ClientLedgerAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const queryParams = new URLSearchParams();
    const clientIdFromUrl = payload?.clientId || window.location.pathname.split('/')[5];
    if (clientIdFromUrl) {
      queryParams.append('clientId', clientIdFromUrl);
    }
    if (payload?.from) {
      queryParams.append('from', payload.from);
    } else {
      queryParams.append('from', String(moment().unix()));
    }
    if (payload?.to) {
      queryParams.append('to', payload.to);
    } else {
      queryParams.append('to', String(moment().unix()));
    }
    const queryString = queryParams.toString();
    const url = `/client-ledger${queryString ? `?${queryString}` : ''}`;

    const response: ApiResponse<{ clients: IClientTable[] }> = yield call(apiCaller, url, 'GET', {}, false);

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

export default function* getClientLedger() {
  yield takeEvery(FETCH_CLIENT_LEDGER, getClientLedgerSaga);
}
