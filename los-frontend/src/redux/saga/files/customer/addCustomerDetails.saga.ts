/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ERROR_MESSAGE, ROUTES, STEPS_NAMES } from '@/lib/enums';
import { ISagaProps } from '@/lib/interfaces/shared';
import { ADD_CUSTOMER_DETAILS_DATA } from '@/redux/actions/types';
import { setActiveStep } from '@/redux/slices/files';
import { setError } from '@/redux/slices/files/customerDetails';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addCustomerDetailsSaga(action: ISagaProps) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<any> = yield call(
      apiCaller,
      '/customer-file/customer_details',
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
      yield put(setActiveStep(STEPS_NAMES.ADDRESS));
      if (navigation) {
        navigation({
          pathname: buildOrgRoute(ROUTES.CUSTOMER_FILE_MANAGEMENT_REGISTER),
          search: `?edit=true&id=${response.data._id}`,
        });
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
  yield takeEvery(ADD_CUSTOMER_DETAILS_DATA, addCustomerDetailsSaga);
}
