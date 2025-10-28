import apiCaller from '@/helpers/apiHelper';
import { FETCH_COLLECTION_BY_CASE_NO } from '@/redux/actions/types';
import { fetchCaseFailure } from '@/redux/slices/collection/collectionCaseNoSlice';
import { setLoading } from '@/redux/slices/publicSlice';
import { FETCH_COLLECTION, FLAG_CASE } from '@/redux/store/actionTypes';
import { call, put, takeLatest } from 'redux-saga/effects';

function* flagCaseSaga(action: {
  type: string;
  payload: {
    caseNo: string;
    isFlagged: boolean;
    flagRemark: string;
  };
}): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));
    const data: any = yield call(apiCaller, `/collection/flag/${action.payload.caseNo}`, 'POST', action.payload);
    if (data) {
      yield put({ type: FETCH_COLLECTION_BY_CASE_NO, payload: action.payload.caseNo });
      yield put({ type: FETCH_COLLECTION });
    } else {
      yield put(fetchCaseFailure('Failed to flag case'));
    }
  } catch (error: any) {
    console.error('Error in fetchCaseSaga:', error.message);
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export function* watchFlagCaseSaga() {
  yield takeLatest(FLAG_CASE, flagCaseSaga);
}
