/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { ERROR_MESSAGE } from '@/lib/enums';
import { ISagaProps } from '@/lib/interfaces/shared';
import { ADD_CUSTOMER_PHOTOS_DATA, GET_CUSTOMER_PHOTOS_DATA } from '@/redux/actions/types';
import { setError, setPhotosAddFormDialog } from '@/redux/slices/files/photos';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addCustomerPhotoSaga(action: ISagaProps) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const id = urlQueryParams('id');
    const response: ApiResponse<{ data: any }> = yield call(
      apiCaller,
      `/customer-file/customer_photos/${id}`,
      'POST',
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
    if (response) {
      yield put(setPhotosAddFormDialog({ [payload.photoGroup as string]: false }));
      yield put({ type: GET_CUSTOMER_PHOTOS_DATA });
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
export default function* addCustomerPhoto() {
  yield takeEvery(ADD_CUSTOMER_PHOTOS_DATA, addCustomerPhotoSaga);
}
