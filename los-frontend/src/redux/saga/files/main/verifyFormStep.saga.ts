import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { FETCH_CUSTOMER_FILES_DATA_SILENT, VERIFY_FORM_STEP } from '@/redux/actions/types';
import { setError } from '@/redux/slices/files';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* verifyFormStepSaga(action: any) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ data: any }> = yield call(
      apiCaller,
      '/customer-file/file-operations/verify-step',
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
      yield put({ type: FETCH_CUSTOMER_FILES_DATA_SILENT });
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* verifyFormStep() {
  yield takeEvery(VERIFY_FORM_STEP, verifyFormStepSaga);
}
