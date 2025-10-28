/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { ERROR_MESSAGE, STEPS_NAMES } from '@/lib/enums';
import { ISagaProps } from '@/lib/interfaces/shared';
import { ADD_CUSTOMER_LIABILITY_DATA } from '@/redux/actions/types';
import { setActiveStep } from '@/redux/slices/files';
import { setError } from '@/redux/slices/files/liability';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addCustomerLiabilitySaga(action: ISagaProps) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  const fileId = urlQueryParams('id');
  try {
    const response: ApiResponse<{ data: any }> = yield call(
      apiCaller,
      `/customer-file/customer_liability/${fileId}`,
      'POST',
      { ...payload },
      true,
      {
        pending: 'Saving data...',
        success: 'Data saved successfully',
        error: 'Failed to save data',
      }
    );
    if (response.data) {
      yield put(setActiveStep(STEPS_NAMES.COLLATERAL));
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* addCustomerLiability() {
  yield takeEvery(ADD_CUSTOMER_LIABILITY_DATA, addCustomerLiabilitySaga);
}
