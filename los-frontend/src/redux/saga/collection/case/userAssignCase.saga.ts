import apiCaller from '@/helpers/apiHelper';
import { setError } from '@/redux/slices/collection/uplodefileSlice';
import { setLoading } from '@/redux/slices/publicSlice';
import { ASSIGN_USER_TO_CASE } from '@/redux/store/actionTypes';
// } from "@/redux/actions/types";
import { FETCH_COLLECTION_BY_CASE_NO } from '@/redux/actions/types';
import { call, put, takeLatest } from 'redux-saga/effects';

function* userAssignCaseSaga(action: { type: string; payload: { caseNo: string; userId: string } }) {
  try {
    yield put(setLoading({ loading: true }));

    const { caseNo, userId } = action.payload;
    yield call(apiCaller, '/collection/assignCases', 'PUT', { caseNo, userId });
    yield put({ type: FETCH_COLLECTION_BY_CASE_NO, payload: caseNo });
  } catch (error: any) {
    yield put(setError(error.response?.data?.error || 'Error assigning case'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export function* watchUserAssignCaseSaga() {
  yield takeLatest(ASSIGN_USER_TO_CASE, userAssignCaseSaga);
}
