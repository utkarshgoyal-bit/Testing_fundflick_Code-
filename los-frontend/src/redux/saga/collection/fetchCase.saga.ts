import apiCaller from '@/helpers/apiHelper';
import { fetchCaseFailure, fetchCaseSuccess } from '@/redux/slices/collection/collectionCaseNoSlice';
import { setLoading } from '@/redux/slices/publicSlice';
import {
  FETCH_COLLECTION_BY_CASE_NO,
  FETCH_USERS_DATA,
  FETCH_COLLECTION,
  FETCH_BRANCHES_DATA,
} from '@/redux/store/actionTypes';
import { call, put, takeLatest } from 'redux-saga/effects';

function* fetchCaseSaga(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));
    const data: any = yield call(apiCaller, `/collection/case/${action.payload}`, 'GET');

    if (data) {
      yield put(fetchCaseSuccess(data));
      yield put({ type: FETCH_USERS_DATA, payload: { silent: true, isBlocked: false } });
      yield put({ type: FETCH_BRANCHES_DATA });
      yield put({ type: FETCH_COLLECTION });
    } else {
      yield put(fetchCaseFailure('No case data found'));
    }
  } catch (error: any) {
    console.error('Error in fetchCaseSaga:', error.message);
    yield put(fetchCaseFailure(error.message || 'Failed to fetch case data'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export function* watchFetchCasesaga() {
  yield takeLatest(FETCH_COLLECTION_BY_CASE_NO, fetchCaseSaga);
}
