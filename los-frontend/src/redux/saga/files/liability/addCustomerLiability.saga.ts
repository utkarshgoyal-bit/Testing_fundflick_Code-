/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { ERROR_MESSAGE } from '@/lib/enums';
import { ISagaProps } from '@/lib/interfaces/shared';
import { ADD_EXISTING_LOAN_DATA, GET_CUSTOMER_LIABILITY_DATA } from '@/redux/actions/types';
import { setError, setLiabilityDialogAdd } from '@/redux/slices/files/liability';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* addExistingLoanData(action: ISagaProps) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  const fileId = urlQueryParams('id');
  try {
    const response: ApiResponse<{ data: any }> = yield call(
      apiCaller,
      `/customer-file/customer_liability/${fileId}/existing-loans`,
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
      yield put({ type: GET_CUSTOMER_LIABILITY_DATA });
      yield put(setLiabilityDialogAdd(false));
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* addExistingLoan() {
  yield takeEvery(ADD_EXISTING_LOAN_DATA, addExistingLoanData);
}
