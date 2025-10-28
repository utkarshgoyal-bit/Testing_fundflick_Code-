import apiCaller from '@/helpers/apiHelper';
import { setLoading } from '@/redux/slices/publicSlice';
import { CREATE_CASE_REMARK } from '@/redux/store/actionTypes';
// } from "@/redux/actions/types";
import { updateBranchFailure } from '@/redux/slices/collection/branchUpdate';
import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_COLLECTION_BY_CASE_NO } from '@/redux/actions/types';
function* createCaseRemarkSaga(action: { type: string; payload: { caseNo: string; remark: string } }) {
  try {
    yield put(setLoading({ loading: true }));
    yield call(apiCaller, '/collection/case/remark/' + action.payload.caseNo, 'POST', action.payload, true, {
      pending: 'Creating case remark...',
      success: 'Case remark created successfully',
      error: 'Failed to save data',
    });
    // const { caseNo } = action.payload;
    yield put({ type: FETCH_COLLECTION_BY_CASE_NO, payload: action.payload.caseNo });
  } catch (error: any) {
    yield put(updateBranchFailure(error.response?.data?.error || 'Error updating branch'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
export function* watchCreateCaseRemark() {
  yield takeLatest(CREATE_CASE_REMARK, createCaseRemarkSaga);
}
