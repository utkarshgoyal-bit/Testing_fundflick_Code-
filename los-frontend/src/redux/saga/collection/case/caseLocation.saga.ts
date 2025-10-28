import apiCaller from '@/helpers/apiHelper';
import { FETCH_COLLECTION, FETCH_COLLECTION_BY_CASE_NO } from '@/redux/actions/types';
import { updateBranchFailure } from '@/redux/slices/collection/branchUpdate';
import { setLoading } from '@/redux/slices/publicSlice';
import { UPDATE_CASE_LOCATION } from '@/redux/store/actionTypes';
import { call, put, takeLatest } from 'redux-saga/effects';

function* caseLocationSaga(action: { type: string; payload: { caseNo: string } }) {
  try {
    yield put(setLoading({ loading: true }));
    yield call(apiCaller, '/collection/case/location', 'POST', action.payload, true, {
      pending: 'Updating case location...',
      success: 'Case location updated successfully',
      error: 'Failed to save data',
    });

    yield put({ type: FETCH_COLLECTION });
    yield put({ type: FETCH_COLLECTION_BY_CASE_NO, payload: action.payload.caseNo });
  } catch (error: any) {
    yield put(updateBranchFailure(error.response?.data?.error || 'Error updating branch'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export function* watchCaseCollectionSaga() {
  yield takeLatest(UPDATE_CASE_LOCATION, caseLocationSaga);
}
