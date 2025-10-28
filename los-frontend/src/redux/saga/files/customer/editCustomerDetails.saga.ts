/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { ERROR_MESSAGE, STEPS_NAMES } from '@/lib/enums';
import { ISagaProps } from '@/lib/interfaces/shared';
import { EDIT_CUSTOMER_DETAILS_DATA, GET_CUSTOMER_PHOTOS_DATA } from '@/redux/actions/types';
import { setActiveStep, setBackOfficeAssociateDialog } from '@/redux/slices/files';
import { setError } from '@/redux/slices/files/customerDetails';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addCustomerDetailsSaga(action: ISagaProps) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  const id = urlQueryParams('id');
  try {
    const response: ApiResponse<{ data: any }> = yield call(
      apiCaller,
      `/customer-file/customer_details/${id}`,
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
        yield put(setBackOfficeAssociateDialog(false));
        yield put({ type: GET_CUSTOMER_PHOTOS_DATA });
      } else {
        yield put(setActiveStep(STEPS_NAMES.ADDRESS));
      }
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* addCustomerDetails() {
  yield takeEvery(EDIT_CUSTOMER_DETAILS_DATA, addCustomerDetailsSaga);
}
