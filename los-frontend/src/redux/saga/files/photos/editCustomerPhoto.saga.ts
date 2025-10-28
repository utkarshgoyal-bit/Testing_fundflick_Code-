/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { ERROR_MESSAGE } from '@/lib/enums';
import { ISagaProps } from '@/lib/interfaces';
import { EDIT_CUSTOMER_PHOTOS_DATA, GET_CUSTOMER_PHOTOS_DATA } from '@/redux/actions/types';
import { setError } from '@/redux/slices/files/photos';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editCustomerPhotoSaga(action: ISagaProps) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  const id = urlQueryParams('id');
  try {
    const response: ApiResponse<{ data: any }> = yield call(
      apiCaller,
      `/customer-file/customer_photos/${id}`,
      'PUT',
      { ...payload },
      true,
      {
        pending: 'Saving data...',
        success: 'Data saved successfully',
        error: 'Failed to save data',
      },
      {
        'Content-Type': 'multipart/form-data',
      }
    );
    if (response.data) {
      yield put({ type: GET_CUSTOMER_PHOTOS_DATA });
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
export default function* editCustomerPhoto() {
  yield takeEvery(EDIT_CUSTOMER_PHOTOS_DATA, editCustomerPhotoSaga);
}
