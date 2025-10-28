import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { FETCH_CUSTOMER_FILES_DATA_SILENT, SUBMIT_CUSTOMER__STATUS } from '@/redux/actions/types';
import { setError } from '@/redux/slices/files';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* HandleFileStatusSaga(action: any) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<any> = yield call(
      apiCaller,
      '/customer-file/file-operations/customer-file-status',
      'POST',
      payload,
      true,
      {
        pending: 'Updating file status...',
        success: 'File status updated successfully',
        error: 'Failed to save data',
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

export default function* HandleFileStatus() {
  yield takeEvery(SUBMIT_CUSTOMER__STATUS, HandleFileStatusSaga);
}
