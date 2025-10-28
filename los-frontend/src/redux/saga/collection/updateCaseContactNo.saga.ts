import apiCaller from '@/helpers/apiHelper';
import { setError } from '@/redux/slices/collection/uplodefileSlice';
import { setLoading } from '@/redux/slices/publicSlice';
import { UPDATE_CASE_CONTACT_NO } from '@/redux/store/actionTypes';
// } from "@/redux/actions/types";
import { FETCH_COLLECTION_BY_CASE_NO } from '@/redux/actions/types';
import { call, put, takeLatest } from 'redux-saga/effects';

function* updateCaseContactNoSaga(action: { type: string; payload: { caseNo: string; contactNo: string } }) {
  try {
    yield put(setLoading({ loading: true }));
    yield call(apiCaller, `/collection/case/contact/${action.payload.caseNo}`, 'POST', action.payload, true, {
      pending: 'Saving case contacts...',
      success: 'Case contacts saved successfully',
      error: 'Failed to save data',
    });

    // yield call(watchFetchCasesaga );
    yield put({ type: FETCH_COLLECTION_BY_CASE_NO, payload: action.payload.caseNo });
  } catch (error: any) {
    yield put(setError(error.response?.data?.error || 'Error updating contacts'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
export function* watchUpdateCaseContactNoSaga() {
  yield takeLatest(UPDATE_CASE_CONTACT_NO, updateCaseContactNoSaga);
}
