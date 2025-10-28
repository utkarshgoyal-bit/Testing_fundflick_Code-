import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IFollowUpPayment } from '@/lib/interfaces';
import { FormFollowupInputs } from '@/pages/collection/main/types';
import { fetchPaymentsFailure, fetchPaymentsSuccess } from '@/redux/slices/collection/folllowUpSlice';
import { setLoading } from '@/redux/slices/publicSlice';
import { FETCH_COLLECTION_FOLLOW_UP_VIEW } from '@/redux/store/actionTypes';
// } from "@/redux/actions/types";
import { call, put, takeLatest } from 'redux-saga/effects';

function* fetchViewFollowPaymentsApi() {
  try {
    yield put(setLoading({ loading: true }));
    const response: ApiResponse<any> = yield call(apiCaller, `/collection/getFollowup`);
    if (!response.data) {
      throw new Error('Failed to fetch payment details.');
    }
    const data: FormFollowupInputs[] = yield response.data;
    return data;
  } catch (error) {
    yield put(setLoading({ loading: false }));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

function* fetchFollowUpByViewSaga() {
  try {
    yield put(setLoading({ loading: true }));

    const data: IFollowUpPayment[] = yield call(fetchViewFollowPaymentsApi);
    if (data) {
      yield put(fetchPaymentsSuccess(data));
    }
  } catch (error: any) {
    yield put(fetchPaymentsFailure(error.message || 'Something went wrong.'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
export function* watchFetchFollowUpByView() {
  yield takeLatest(FETCH_COLLECTION_FOLLOW_UP_VIEW, fetchFollowUpByViewSaga);
}
