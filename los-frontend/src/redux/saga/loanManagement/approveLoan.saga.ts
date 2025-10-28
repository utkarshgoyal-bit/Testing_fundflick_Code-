import { call, put, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { APPROVE_LOAN } from '@/redux/actions/types';
import apiCaller from '@/helpers/apiHelper';
import { ApproveLoanApiResponse } from '@/lib/interfaces';

function* approveLoanSaga(
  action: PayloadAction<{ loanId: number; disbursementDate?: string }>
): Generator<any, void, any> {
  try {
    yield put({ type: APPROVE_LOAN });
    const response: ApproveLoanApiResponse = yield call(apiCaller, `/loans/${action.payload.loanId}/approve`, 'POST', {
      disbursementDate: action.payload.disbursementDate,
    });
    const { success, message } = response.data;
    if (success) {
      yield put({ type: APPROVE_LOAN, payload: response.data });
    } else {
      yield put({ type: APPROVE_LOAN, payload: message });
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to approve loan';
    yield put({ type: APPROVE_LOAN, payload: errorMessage });
  }
}
export default function* watchApproveLoanSaga(): Generator<any, void, any> {
  yield takeEvery(APPROVE_LOAN, approveLoanSaga);
}
