import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { FETCH_CUSTOMER_FILES_BY_ID_DATA, TELEPHONE_QUESTION_VERIFICATION } from '@/redux/actions/types';
import { setError } from '@/redux/slices/files';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* verifyTelephoneQuestionStepSaga(action: any) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ data: any }> = yield call(
      apiCaller,
      '/customer-file/file-operations/telephone-verification',
      'POST',
      payload,
      true,
      {
        pending: 'Verifying data...',
        success: 'Data verified successfully',
        error: 'Failed to Verify',
      },
      {
        'Content-Type': 'application/json',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_CUSTOMER_FILES_BY_ID_DATA });
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* verifyTelephoneQuestionStep() {
  yield takeEvery(TELEPHONE_QUESTION_VERIFICATION, verifyTelephoneQuestionStepSaga);
}
