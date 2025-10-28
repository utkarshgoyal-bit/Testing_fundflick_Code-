/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { ERROR_MESSAGE } from '@/lib/enums';
import { ISagaProps } from '@/lib/interfaces/shared';
import {
  EDIT_CUSTOMER_ASSOCIATES_DATA,
  GET_CUSTOMER_ASSOCIATES_DATA,
  GET_CUSTOMER_PHOTOS_DATA,
} from '@/redux/actions/types';
import { setEditAssociateFormDialog, setError } from '@/redux/slices/files/associates';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editCustomerAssociatesSaga(action: ISagaProps) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  const id = new URLSearchParams(window.location.search).get('id');

  try {
    const response: ApiResponse<{ data: any }> = yield call(
      apiCaller,
      `/customer-file/customer_associates/${id}`,
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
      if (urlQueryParams('component') == 'back_office') {
        yield put({ type: GET_CUSTOMER_PHOTOS_DATA });
      } else {
        yield put({ type: GET_CUSTOMER_ASSOCIATES_DATA });
        yield put(setEditAssociateFormDialog(false));
      }
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* editCustomerAssociates() {
  yield takeEvery(EDIT_CUSTOMER_ASSOCIATES_DATA, editCustomerAssociatesSaga);
}
