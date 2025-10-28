import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IUserTable } from '@/lib/interfaces/tables';
import { call, put, takeEvery } from 'redux-saga/effects';
import { RECEIVE_LEDGER_BALANCE, FETCH_USERS_DATA } from '@/redux/actions/types';
import { setDialogLoading, setError } from '@/redux/slices/users';
import { IRegisterUsersAction } from '@/lib/interfaces/';

function* receiveLedgerUsersData(action: IRegisterUsersAction) {
  yield put(setDialogLoading(true));
  const { payload } = action;
  try {
    const response: ApiResponse<{ users: IUserTable[] }> = yield call(
      apiCaller,
      '/user/receiveLedgerBalance',
      'POST',
      payload,
      true,
      {
        pending: 'Receiving ledger amount...',
        success: 'Ledger Amount successfully',
        error: 'An error occurred while receiving ledger Amount',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_USERS_DATA, payload: { silent: true, isBlocked: false } });
    }
    if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setDialogLoading(false));
  }
}
export default function* watchReceiveLedgerUserData() {
  yield takeEvery(RECEIVE_LEDGER_BALANCE, receiveLedgerUsersData);
}
