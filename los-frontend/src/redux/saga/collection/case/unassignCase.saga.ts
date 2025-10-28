import apiCaller from '@/helpers/apiHelper';
import { setError } from '@/redux/slices/collection/uplodefileSlice';
import { setLoading } from '@/redux/slices/publicSlice';
import { UNASSIGN_CASE_USER } from '@/redux/store/actionTypes';
// } from "@/redux/actions/types";
import { FETCH_COLLECTION_BY_CASE_NO } from '@/redux/actions/types';
import { call, put, takeLatest } from 'redux-saga/effects';

function* unassignCaseSaga(action: { type: string; payload: { caseNo: string } }) {
  try {
    yield put(setLoading({ loading: true }));

    const { caseNo } = action.payload;
    yield call(apiCaller, '/collection/unassignCase', 'PUT', { caseNo });
    yield put({ type: FETCH_COLLECTION_BY_CASE_NO, payload: action.payload.caseNo });
  } catch (error: any) {
    yield put(setError(error.response?.data?.error || 'Error un-assigning case'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export function* watchUnassignCaseSaga() {
  yield takeLatest(UNASSIGN_CASE_USER, unassignCaseSaga);
}
