import apiCaller from '@/helpers/apiHelper';
import { FETCH_COLLECTION_BY_CASE_NO } from '@/redux/actions/types';
import { setError } from '@/redux/slices/collection/uplodefileSlice';
import { setLoading } from '@/redux/slices/publicSlice';
import { DELETE_CASE_REMARK } from '@/redux/store/actionTypes';
import { call, put, takeLatest } from 'redux-saga/effects';

function* deleteCaseRemarkSaga(action: { type: string; payload: { caseNo: string; remarkId: string } }) {
  try {
    yield put(setLoading({ loading: true }));
    yield call(
      apiCaller,
      `/collection/case/remark/${action.payload.caseNo}/${action.payload.remarkId}`,
      'DELETE',
      action.payload,
      true,
      {
        pending: 'Creating case remark...',
        success: 'Case remark created successfully',
        error: 'Failed to save data',
      }
    );
    //   const { caseNo } = action.payload;
    yield put({ type: FETCH_COLLECTION_BY_CASE_NO, payload: action.payload.caseNo });
  } catch (error: any) {
    yield put(setError(error.response?.data?.error || 'Error updating contacts'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export function* watchdeleteRemarkSaga() {
  yield takeLatest(DELETE_CASE_REMARK, deleteCaseRemarkSaga);
}
