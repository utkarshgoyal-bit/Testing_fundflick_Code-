import { ERROR_MESSAGE } from '@/lib/enums';
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_CUSTOMER_FILES_BY_ID_DATA, UPDATE_CIBIL_SCORE } from '@/redux/actions/types';
import { setError } from '@/redux/slices/files';
import { setLoading } from '@/redux/slices/publicSlice';

function* updateCibilScoreSaga(action: any) {
  const payload = action.payload;
  yield put(setLoading({ loading: true }));
  const fileId = urlQueryParams('id');
  try {
    const response: ApiResponse<any> = yield call(
      apiCaller,
      `/customer-file/file-operations/${fileId}/cibil-score`,
      'POST',
      payload,
      false,
      {
        pending: 'Updating cibil score...',
        success: 'Cibil score updated successfully',
        error: 'Failed to save data',
      },
      {
        'Content-Type': 'multipart/form-data',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_CUSTOMER_FILES_BY_ID_DATA });
    }
  } catch (error) {
    console.error('Failed to fetch customer file:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* updateCibilScore() {
  yield takeEvery(UPDATE_CIBIL_SCORE, updateCibilScoreSaga);
}
