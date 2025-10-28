import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { ERROR_MESSAGE } from '@/lib/enums';
import { ISagaProps } from '@/lib/interfaces';
import {
  ADD_CUSTOMER_ASSOCIATES_DATA,
  GET_CUSTOMER_ASSOCIATES_DATA,
  GET_CUSTOMER_PHOTOS_DATA,
} from '@/redux/actions/types';
import { setAddAssociateFormDialog, setError } from '@/redux/slices/files/associates';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';
function* addCustomerAssociatesSaga(action: ISagaProps) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  const id = new URLSearchParams(window.location.search).get('id');

  try {
    const response: ApiResponse<{ data: any }> = yield call(
      apiCaller,
      `/customer-file/customer_associates/${id}`,
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
    if (response.data) {
      if (urlQueryParams('component') == 'back_office') {
        yield put({ type: GET_CUSTOMER_PHOTOS_DATA });
      } else {
        yield put({ type: GET_CUSTOMER_ASSOCIATES_DATA });
        yield put(setAddAssociateFormDialog(false));
      }
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* addCustomerAssociates() {
  yield takeEvery(ADD_CUSTOMER_ASSOCIATES_DATA, addCustomerAssociatesSaga);
}
